// ==UserScript==
// @name         Revivers Search
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Do you revive?
// @author       You
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421264/Revivers%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/421264/Revivers%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var StartDate = '2020-11-08';

     addGlobalStyle(`

.jox-name, .jox-stat i{
    font-size: larger;
    font-weight: bolder;
}

.jox-stats-container{
    margin: 5px auto;
}

`);

    var regex = /(https:\/\/www\.torn\.com\/personalstats\.php\?ID=)(\d+)(&stats=.+)/gm;

    if(window.location.href.startsWith('https://www.torn.com/profiles.php')){
        addLinkToProfile();
    }

    function addLinkToProfile(){
        if(!document.getElementById('jox-revive-stats-link')){
            let container = document.getElementById('skip-to-content');

            if(!document.querySelector('.basic-information')){
                setTimeout(addLinkToProfile, 1000);
            }
            else{
                var player = document.querySelector('.basic-information .user-information-section+div>span').innerHTML;
                var id = player.replace(/(.+\[)(\d+)(\])/gm, '$2');

                let a = document.createElement('a');
                a.href = `https://www.torn.com/personalstats.php?ID=${id}&stats=revives&from=1%20month`;
                a.innerHTML = 'Check revives';

                insertAfter(a, container);
            }
        }
    }

    function doSomething(stats){
        if(stats.labels && stats.datasets){

            let statsContainers = document.querySelectorAll('.jox-stats-container');
            for(let elem of statsContainers){
               elem.remove();
            }

            Object.keys(stats.datasets).forEach(key => {
                setTimeout(function(){
                    let playerId = key;
                    let playerNamesTags = document.querySelectorAll('.selectUsers___1CTx5 .user___1Fh_v')

                    let playerNames = {};

                    for(let playerNameTag of playerNamesTags){
                        let nameStr = playerNameTag.innerHTML;
                        let regEx = /(\S+)\s*\[(\d+)\]/gm
                        let x = regEx.exec(nameStr);
                        playerNames[x[2]] = {name : x[0]};
                    }

                    //let playerNames = playerNamesTags.map(x => ()x.innerHTML.exec());
                    let startDataIndex = stats.labels.indexOf(StartDate);
                    if(stats.datasets[playerId].revives){
                        let startRevives = stats.datasets[playerId].revives[startDataIndex];
                        let endRevives = stats.datasets[playerId].revives[0];
                        let periodStartRevives = stats.datasets[playerId].revives[stats.labels.length-1];

                        let reference = document.getElementById('react-root');
                        let div = document.createElement('div');
                        div.classList.add('jox-stats-container')
                        div.innerHTML = `<span class="jox-name">${playerNames[playerId].name}</span>
<span class="jox-stat">Revives from date: <i>${endRevives - startRevives}</i></span>
<span class="jox-stat">Revives for period: <i>${endRevives - periodStartRevives}</i></span>
`;
                        insertBefore(div, reference);
                    }
                    else{
                        console.log('Missing revive info');
                    }
                },300);
            });
        }
    }


    // save the original fetch
    const original_fetch = fetch

    // replace the page's fetch with our own
    window.fetch = async (input, init) => {
        //console.log('initiating fetch', input, init)

        const response = await original_fetch(input, init)

        //console.log('fetch done', response)

        // on certain requests...
        let filterRegex = /^.*personalstats\.php.*$/;

        if (filterRegex.test(response.url)) {
            // clone the response so we can look at its contents
            // otherwise we'll consume them and the page won't be able to read them
            const clone = response.clone()

            // parse and read the cloned response as json(), text() or whatever
            // note we do not await or we'll delay the response for the page
            //clone.json().then((json) => console.log('fetched data', json))
            clone.json().then((json) => {doSomething(json);});
        }

        return response
    }

    function insertBefore(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    //Helper function for more readability
    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
})();