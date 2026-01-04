// To run, install GreaseMonkey or TamperMonkey extension in your browser
// Copy this code into new user script, and enable

// ==UserScript==
// @name         Disable Youtube autoplay
// @namespace    disable_youtube_autoplay
// @version      1.0
// @description  This script turns off Youtube autoplay feature after the page loads
// @author       shellster
// @match        *://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433201/Disable%20Youtube%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/433201/Disable%20Youtube%20autoplay.meta.js
// ==/UserScript==

(function() {       
    function disableAfterLoad() {
        var toggle = document.querySelector('div.ytp-autonav-toggle-button');
        
        flag = true;
      
        if(toggle)
        {
            title = toggle.parentNode.parentNode.getAttribute("title");
            
            if(title && title.indexOf(" on") != -1)
            {
                toggle.click();
            }
            else
            {
                flag = false;
            }
        }
        
        if(flag)
            setTimeout(disableAfterLoad, 1000);
    }

    disableAfterLoad();
})();