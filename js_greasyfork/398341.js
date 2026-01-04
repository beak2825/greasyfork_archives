// ==UserScript==
// @name         Facebook Dark Theme Sync
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Switch Facebook's theme to match the system
// @author       You
// @match        https://www.facebook.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398341/Facebook%20Dark%20Theme%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/398341/Facebook%20Dark%20Theme%20Sync.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $( document ).ready(function() {
        let systemDarkEnabled = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        let isDarkEnabled = $('body').html().indexOf('["CometDarkModeSetting",[],{"initialSetting":"ENABLED"}') != -1;
        console.log("systemDarkEnabled " + systemDarkEnabled + " isDarkEnabled " + isDarkEnabled);
        setTimeout(function() {
            //Check if themes are not in sync
            if(systemDarkEnabled != isDarkEnabled){
                if(systemDarkEnabled){
                    document.querySelector('html').classList.add('__fb-dark-mode');
                }else{
                    document.querySelector('html').classList.remove('__fb-dark-mode');
                }
            }
        }, 1000);
    });
})();