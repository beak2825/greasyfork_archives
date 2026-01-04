// ==UserScript==
// @name         Dog Tag Search
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take all tags!
// @author       You
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412364/Dog%20Tag%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/412364/Dog%20Tag%20Search.meta.js
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
        if(!document.getElementById('jox-dog-tag-stats-link')){
            let container = document.getElementById('skip-to-content');

            if(!document.querySelector('.basic-information')){
                setTimeout(addLinkToProfile, 500);
            }
            else{
                var player = document.querySelector('.basic-information .user-information-section+div>span').innerHTML;
                var id = player.replace(/(.+\[)(\d+)(\])/gm, '$2');

                let a = document.createElement('a');
                a.href = `https://www.torn.com/personalstats.php?ID=${id}&stats=attackswon,defendslost&from=1%20month`;
                a.innerHTML = 'Check DogTags attacks/defends';

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
                    if(stats.datasets[playerId].attackswon && stats.datasets[playerId].defendslost){
                        let startDefenseLost = stats.datasets[playerId].defendslost[startDataIndex];
                        let endDefenseLost = stats.datasets[playerId].defendslost[0];
                        let startAttackWon = stats.datasets[playerId].attackswon[startDataIndex];
                        let endAttackWon = stats.datasets[playerId].attackswon[0];

                        let reference = document.getElementById('react-root');
                        let div = document.createElement('div');
                        div.classList.add('jox-stats-container')
                        div.innerHTML = `<span class="jox-name">${playerNames[playerId].name}</span>
<span class="jox-stat">Attacks Won: <i>${endAttackWon - startAttackWon}</i></span>
<span class="jox-stat">Defense Lost: <i>${endDefenseLost - startDefenseLost}</i></span>
<span class="jox-stat">Difference: <i>${(endAttackWon - startAttackWon) - (endDefenseLost - startDefenseLost)}</i></span>
<a href="https://www.torn.com/loader.php?sid=attack&user2ID=${playerId}">Attack</a>
`;
                        insertBefore(div, reference);
                    }
                    else{
                        console.log('Missing attack and defends info');
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