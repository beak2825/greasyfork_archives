// ==UserScript==
// @name         Knolix Auto Skip Ad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the Skip Ad button on Knolix ads page
// @author       Rubystance
// @license      MIT
// @match        https://ads.knolix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546172/Knolix%20Auto%20Skip%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/546172/Knolix%20Auto%20Skip%20Ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function triggerClick(element){
        if(!element) return;
        let event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    function skipAd(){
        let skipBtn = document.querySelector("#skip_button");
        if(skipBtn){
            triggerClick(skipBtn);
            console.log("[Tampermonkey] Skip Ad button clicked!");
        } else {
            console.log("[Tampermonkey] Skip Ad button not found yet, retrying...");
        }
    }

    let interval = setInterval(()=>{
        skipAd();
        if(document.querySelector("#skip_button") === null){
            clearInterval(interval);
        }
    }, 1000);

})();
