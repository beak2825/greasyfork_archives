// ==UserScript==
// @name         Reddit Dark Theme Sync
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Switch Reddit's theme to match the system
// @author       You
// @match        https://www.reddit.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398340/Reddit%20Dark%20Theme%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/398340/Reddit%20Dark%20Theme%20Sync.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#header").ready(function() {
        let systemDarkEnabled = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        let style = getComputedStyle(document.body);
        let isDarkEnabled = getComputedStyle(document.getElementsByTagName("header")[0].firstElementChild).getPropertyValue('--newRedditTheme-body').trim() == "#1A1A1B"
        //Check if themes are not in sync
        if(systemDarkEnabled != isDarkEnabled){
            //Reddit takes ages to load
            setTimeout(function() {
                //Open account menu
                let accountMenu = $("#USER_DROPDOWN_ID");
                accountMenu.click();
                //Delay a second to allow the menu to open
                setTimeout(function() {
                    //Find and click the switcher
                    let switcher = $("button:contains('Dark Mode')").last();
                    switcher.click();
                }, 1000);
            }, 3000);
        }
    });
})();