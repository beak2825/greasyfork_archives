// ==UserScript==
// @name         Wall timer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Wall timer for win
// @author       Jox [1714547]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/401750/Wall%20timer.user.js
// @updateURL https://update.greasyfork.org/scripts/401750/Wall%20timer.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var fetchData = null;
    var fetchUrl = 'https://www.torn.com/faction_wars.php';

    function onFetch(){
        //console.log('FetchData', fetchData);

        let i = 0;

        if(fetchData && fetchData.wars){
            for(let war of fetchData.wars){
                i++; //increment at start cause selectof used is nth-child with first element is @ 1
                if(war.key && war.key !== 'chain' && war.key !== 'rank'){

                    let remainingTime = (war.endDate - (war.lastUpdate * 1000)) / 1000;
                    let remainingScore = war.maxPoints - war.score;
                    let slotsNeeded = remainingScore / remainingTime;

                    let msg = '';

                    if(slotsNeeded > war.slots){
                        msg = `[ Can't win ]`;
                    }
                    else{
                        msg = `[ ${war.isMyAttack ? Math.ceil(slotsNeeded) : Math.floor(slotsNeeded)} for win ]`
                    }

                    let remainingPoints = war.maxPoints - war.score;
                    let timeToTakeOver = Math.floor(remainingPoints / (war.isMyAttack ? war.myFaction.membersQuantity - war.enemyFaction.membersQuantity : war.enemyFaction.membersQuantity - war.myFaction.membersQuantity));

                    let timer = secondsToString((timeToTakeOver > 0 ? timeToTakeOver : Infinity));

                    //console.log(war);

                    let myElem = document.getElementById(`myElem${war.key}`);

                    if(!myElem){
                        //let selector = `#react-root .status-wrap a[href^="#/war/${war.key}"] .faction-progress-wrap`;
                        let selector = `#react-root > div > div > ul > li:nth-child(${i}) > div > div.info div.timer`;
                        let container = document.querySelector(selector);
                        if(container){
                            myElem = document.createElement('div');
                            myElem.id = `myElem${war.warID}`;
                            container.appendChild(myElem);
                        }
                    }

                    if(myElem){
                        myElem.innerHTML = timer + ' ' + msg;
                    }
                }
            }
        }
    }

    function secondsToString(totalSeconds){

        if(totalSeconds === Infinity){
            return Infinity;
        }

        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        // If you want strings with leading zeroes:
        minutes = String(minutes).padStart(2, "0");
        hours = String(hours).padStart(2, "0");
        seconds = String(seconds).padStart(2, "0");
        return (hours + ":" + minutes + ":" + seconds);
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
})();