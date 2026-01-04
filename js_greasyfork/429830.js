// ==UserScript==
// @name         OC Stats Check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Find PA candidates
// @author       You
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429830/OC%20Stats%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/429830/OC%20Stats%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var StartDate = '2020-11-04';

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
        if(!document.getElementById('jox-oc-stats-link')){
            let container = document.getElementById('skip-to-content');

            if(!document.querySelector('.basic-information ul')){
                setTimeout(addLinkToProfile, 500);
            }
            else{
                var player = document.querySelector('.basic-information ul li:nth-child(1) .user-information-section+div>span').innerHTML;
                var id = player.replace(/(.+\[)(\d+)(\])/gm, '$2');

                let a = document.createElement('a');
                a.href = `https://www.torn.com/personalstats.php?ID=${id}&stats=organisedcrimes&from=6%20months`;
                a.innerHTML = 'Check OC Stats';

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
                    if(stats.datasets[playerId].organisedcrimes){
                        //let startOrganisedCrimes = stats.datasets[playerId].organisedcrimes[0];
                        //let endOrganisedCrimes = stats.datasets[playerId].organisedcrimes[stats.datasets[playerId].organisedcrimes.length-1];
                        let OCinterval = '';

                        let prevCount = stats.datasets[playerId].organisedcrimes[0];
                        let counter = 0;

                        for(let i = 1; i < stats.datasets[playerId].organisedcrimes.length; i++){ //skipping first
                            if(prevCount == stats.datasets[playerId].organisedcrimes[i]){
                                counter++;
                            }
                            else{
                                OCinterval += `${OCinterval.length > 0 ? ', ' : '' }${counter}`;
                                prevCount = stats.datasets[playerId].organisedcrimes[i];
                                counter = 0;
                            }
                        }

                        let farudCrimesRow = document.querySelector('#react-root > div > section.statsSection___21AXs > div.stats___2SGlK > div.categoriesValues___1XpIO.withScroll___2NTBG > div > div:nth-child(9) > div.statRows___jm5Oa > div:nth-child(7) > div.statValue___qKLYH > span:nth-child(2)');


                        let reference = document.getElementById('react-root');
                        let div = document.createElement('div');
                        div.classList.add('jox-stats-container')
                        div.innerHTML = `<span class="jox-name">${playerNames[playerId].name}</span>
<span class="jox-stat">Fraud: <i>${farudCrimesRow.innerHTML}</i></span>
<span class="jox-stat">OC Interval: <i>${OCinterval}</i></span>
`;
                        insertBefore(div, reference);
                    }
                    else{
                        console.log('Missing OC info');
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