// ==UserScript==
// @name         Feedly - Open in Background Tab
// @namespace    https://github.com/theborg3of5/Userscripts/
// @version      1.6
// @description  Open the currently-selected post in Feedly in a new background tab using the semicolon key. NOTE: this does not work for all layouts - see the linked extension for more robust handling.
// @author       Gavin Borg
// @match        http*://feedly.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/394974/Feedly%20-%20Open%20in%20Background%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/394974/Feedly%20-%20Open%20in%20Background%20Tab.meta.js
// ==/UserScript==

// Based on Feedly Background Tab by Aaron Saray: https://chrome.google.com/webstore/detail/feedly-background-tab/gjlijkhcebalcchkhgaiflaooghmoegk ( source: https://github.com/aaronsaray/feedlybackgroundtab )

(function() {
    'use strict';

    if(getHotkeyCode() == "") {
        console.log("FeedlyOpenInBackground: failed to determine hotkey");
        return;
    }

    document.onkeyup = function(e) {
        //console.log("Caught key code: " + e.which + ", hotkey is key code: " + getHotkeyCode());
        if (e.which == getHotkeyCode()) {
            var url = getURL();
            if(url) {
                console.log(url);
                var options = {active:false, insert:false}; // tweaks to open tabs in background after all other tabs (check options object below)
                GM_openInTab(url,options);
            }
        }
    };
})();

function getHotkeyCode() {
    var userAgent = navigator.userAgent;
    if(userAgent.includes("Chrome/")) {
        return 186; // Semicolon in Chrome
    }
    if(userAgent.includes("Firefox/")) {
        return 59; // Semicolon in Firefox
    }

    return "";
}

function getURL() {
    var selectors = [
        'a.EntryTitleLink--selected', // Collapsed entry for Title-Only, Magazine, Cards
        'a.ArticleTitle', // Expanded entry for Title-Only, Magazine, Cards
        // No good option for article view at this time :(
    ]
    var link;

    for(var selector of selectors) {
        link = document.querySelector(selector);
        if(link) {
            break;
        }
    }

    if(!link) {
        return "";
    }

    return link.href;
}
