// ==UserScript==
// @name         YouTube Auto Confirm
// @version      0.3
// @description  Auto-Clicks on "Yes" when asked "Video paused. Continue watching?"
// @author       RustyPrimeLUX
// @match        https://www.youtube.com/*
// @license      MIT
// @namespace    none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409090/YouTube%20Auto%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/409090/YouTube%20Auto%20Confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var checkDelay = 2000; // checks every 2 seconds if the pop-up has appeared
    var popUp = null;
    
    setInterval(function(){
        if(popUp == null){
            popUp = document.querySelector("#confirm-button");
        }
        if(popUp == null)
        {
            return;
        }

        if (isVisible(popUp))
        {
            popUp.click();
        }
        
    }, checkDelay);

    function isVisible(el) {
        return (el.offsetParent !== null)
    }
})();
