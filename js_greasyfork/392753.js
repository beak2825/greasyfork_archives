// ==UserScript==
// @name         CT Treasure Hunt :P
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Torn CT 2019
// @author       Jox [1714547]
// @match        https://www.torn.com/christmas_town.php*
// @require      https://greasyfork.org/scripts/392756-torn-ct-map-draw-class/code/Torn%20CT%20Map%20Draw%20Class.user.js?v=8
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392753/CT%20Treasure%20Hunt%20%3AP.user.js
// @updateURL https://update.greasyfork.org/scripts/392753/CT%20Treasure%20Hunt%20%3AP.meta.js
// ==/UserScript==

(function() {
'use strict';

    //Initialize class
    var ctMap = new ctMapDraw(document.querySelector('.core-layout__viewport'));


    function checkForItems(){
        //console.log('Checking For Items...');

        let world = document.getElementById('world');
        let itemsLayer = world.querySelector('.items-layer');
        let items = itemsLayer.querySelectorAll('.ct-item');

        for(let item of items){
            let img = item.querySelector('img');
            if(img && img.src.includes('chest')){
                item.classList.add('pulseB');
            }
            else{
                if(img && img.src.includes('keys')){
                    item.classList.add('pulseM');
                }
                else{
                    if(img && img.src.includes('combinationChest')){
                        item.classList.add('pulseG');
                    }
                    else{
                        item.classList.add('pulseY');
                    }
                }
            }
        }
    }

    function checkForNPCs(){
        let NPCs = fetchData.mapData.users.filter(user => {return isNaN(user.user_id)});
        if(NPCs.length){
            console.log(NPCs);
            for(let npc in NPCs){
                let npcElement = document.getElementById('ctUser' + NPCs[npc].user_id);
                if(NPCs[npc].playername.toLowerCase().includes("santa")){
                    npcElement.classList.add('pulseR');
                }
                else{
                    npcElement.classList.add('pulseD');
                }
            }
        }
    }

    var fetchData = null;
    var fetchUrl = 'https://www.torn.com/christmas_town.php?q=';

    function onFetch(){
        //console.log('FetchData', fetchData);

        //Check for items
        if(fetchData.mapData && fetchData.mapData.items){
            checkForItems();
        }

        //Check for NPCs
        if(fetchData.mapData && fetchData.mapData.users){
            checkForNPCs();
        }

        //Draw map
        ctMap.draw();
    }

    // save the original fetch
    const original_fetch = fetch

    // replace the page's fetch with our own
    window.fetch = async (input, init) => {
        //console.log('initiating fetch', input, init)

        const response = await original_fetch(input, init)

        //console.log('fetch done', response)

        // on certain requests...
        if (response.url.startsWith(fetchUrl)) {
            // clone the response so we can look at its contents
            // otherwise we'll consume them and the page won't be able to read them
            const clone = response.clone()

            // parse and read the cloned response as json(), text() or whatever
            // note we do not await or we'll delay the response for the page
            //clone.json().then((json) => console.log('fetched data', json))
            clone.json().then((json) => {fetchData = json; onFetch()});
        }

        return response
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

    addGlobalStyle('.pulseY {border-radius: 50%; box-shadow: 0 0 0 rgba(204,169,44, 0.4); animation: pulseY 2s infinite;}  @keyframes pulseY { 0% { box-shadow: 0 0 0 0 rgba(204,169,44, 0.8); } 90% { box-shadow: 0 0 0 500px rgba(204,169,44, 0); } 100% { box-shadow: 0 0 0 0 rgba(204,169,44, 0); } }');
    addGlobalStyle('.pulseG {border-radius: 50%; box-shadow: 0 0 0 rgba(0,200,40, 0.4); animation: pulseG 2s infinite;}  @keyframes pulseG { 0% { box-shadow: 0 0 0 0 rgba(0,200,40, 0.8); } 90% { box-shadow: 0 0 0 500px rgba(0,150,40, 0); } 100% { box-shadow: 0 0 0 0 rgba(0,200,40, 0); } }');
    addGlobalStyle('.pulseB {border-radius: 50%; box-shadow: 0 0 0 rgba(63,183,252, 0.4); animation: pulseB 2s infinite;}  @keyframes pulseB { 0% { box-shadow: 0 0 0 0 rgba(63,183,252, 0.8); } 90% { box-shadow: 0 0 0 500px rgba(63,183,252, 0); } 100% { box-shadow: 0 0 0 0 rgba(63,183,252, 0); } }');
    addGlobalStyle('.pulseM {border-radius: 50%; box-shadow: 0 0 0 rgba(183,63,252, 0.4); animation: pulseM 2s infinite;}  @keyframes pulseM { 0% { box-shadow: 0 0 0 0 rgba(183,63,252, 0.8); } 90% { box-shadow: 0 0 0 500px rgba(183,63,252, 0); } 100% { box-shadow: 0 0 0 0 rgba(183,63,252, 0); } }');
    addGlobalStyle('.pulseR {border-radius: 50%; box-shadow: 0 0 0 rgba(227,90,52, 0.4); animation: pulseR 2s infinite;}  @keyframes pulseR { 0% { box-shadow: 0 0 0 0 rgba(227,90,52, 0.8); } 90% { box-shadow: 0 0 0 500px rgba(227,90,52, 0); } 100% { box-shadow: 0 0 0 0 rgba(227,90,52, 0); } }');
    addGlobalStyle('.pulseD {border-radius: 50%; box-shadow: 0 0 0 rgba(200,200,200, 0.4); animation: pulseD 2s infinite;}  @keyframes pulseD { 0% { box-shadow: 0 0 0 0 rgba(200,200,200, 0.8); } 90% { box-shadow: 0 0 0 100px rgba(200,200,200, 0); } 100% { box-shadow: 0 0 0 0 rgba(200,200,200, 0); } }');

    //hide map directions
    addGlobalStyle('.d #ct-wrap .user-map-container .user-map:before {z-index: 0 !important}');

})();