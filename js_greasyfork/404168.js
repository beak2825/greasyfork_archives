// ==UserScript==
// @name         Torn: Show Experience
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Show weapon experience number & hits required for 100% exp rather than progress bar
// @author       Untouchable [1360035]
// @match        https://www.torn.com/item.php
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404168/Torn%3A%20Show%20Experience.user.js
// @updateURL https://update.greasyfork.org/scripts/404168/Torn%3A%20Show%20Experience.meta.js
// ==/UserScript==

(function() {
    'use strict';

    show();

})();

function show() {

    // Set this to false if you do not wish to see Proxima's Weapon Quality
    let ShowProxiQual = true;

    waitForKeyElements('.player-weapon',() => {

        let keys = ["0","1","2","3"]
        Object.keys($('.experience-wrap')).forEach((e) => {
            if(keys.includes(e)){
                let i = parseInt(e),
                    percent = $('.experience-wrap')[i].title;

                let dmg = $('.weapon-box')[i].children[4].childNodes[5].childNodes[1].childNodes[1].innerText;
                let acc = $('.weapon-box')[i].children[4].childNodes[5].childNodes[1].childNodes[5].innerText;

                $('.experience-wrap')[i].title = percent + " experience, " + getHits(percent) + " damage dealing hits required until 100%";

                if(ShowProxiQual){
                    $('.experience-wrap')[i].innerHTML = `<span title="Proxima's Magic Quality" class="na t-red">` + getProxiQual(dmg,acc) + `</span>`
                        + `<span>&nbsp|&nbsp<span><span class="na t-gray-9">` + percent + ` (` + getHits(percent) + `)</span>`;
                } else {
                    $('.experience-wrap')[i].innerHTML = `<span><span class="na t-gray-9">` + percent + ` (` + getHits(percent) + `)</span>`;
                }
            }
        })

    });

}

function getHits(experience){

   let hits, exp = parseInt(experience.replace("%",""));

    if(exp < 25){
        hits = (25 - exp) * 8 + 1800;
    } else if (exp >= 25 && exp < 50){
        hits = (50 - exp) * 12 + 1500
    } else if (exp >= 50 && exp <75) {
        hits = (75 - exp) * 20 + 1000;
    } else {
        hits = (100 - exp) * 40;
    }

    return hits ;

}

function getProxiQual(dmg,acc){

    let damage = parseFloat(dmg), accuracy = parseFloat(acc);

    let ProxiQual = accuracy / 100 * (1 + Math.log( ( ( ( Math.exp( ( damage - 0.005 ) / 19 + 2 ) - 13 ) + ( Math.exp( ( damage + 0.005 ) / 19 + 2 ) - 13 ) ) / 2).toFixed(0) ) ) * 10;

    return ProxiQual.toFixed(2);

}