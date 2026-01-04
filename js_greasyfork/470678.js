// ==UserScript==
// @name         DRDK_MINUS_SPORT
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Highligth or hide sportnews on DR.DK so they don't clutter the news as much
// @author       You
// @match        https://www.dr.dk/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dr.dk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470678/DRDK_MINUS_SPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/470678/DRDK_MINUS_SPORT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("Window loaded, lets go!!!")
    const elname = "dre-grid-layout-list__item"
    let k = document.getElementsByClassName(elname)
    for (let i = 0; i < k.length; i++) {
        if(k.item(i).innerHTML.includes("sport")){
            //k.item(i).style.visibility = "hidden"
            k.item(i).style.background = "red"
        }
    }

})();

// OG
/*    console.log("Window loaded, lets go!!!")
    const elname = "dre-grid-layout-list__item"
    let k = document.getElementsByClassName(elname)
    for (let i = 0; i < k.length; i++) {
        if(k.item(i).innerHTML.includes("sport")){
            k.item(i).style.visibility = "hidden"
        }
    }
*/