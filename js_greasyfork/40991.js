// ==UserScript==
// @name         Central Script
// @namespace    none
// @version      0.2
// @description  The best central userscript
// @require https://code.jquery.com/jquery-3.1.1.js
// @author       Tides (Tides#7945)
// @match        https://www.wizard101central.com/*
// @match        www.wizard101central.com/*
// @match        wizard101central.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40991/Central%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/40991/Central%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        let usernames = document.getElementsByClassName("username");
        let usertitles = document.getElementsByClassName("usertitle");

        for (var i=0; i<usernames.length; i++) {
            if (usernames[i].children[0].innerHTML == '<span style="color: green; font-weight: bold;">Willowdreamer</span>') {
                usernames[i].children[0].innerHTML = '<span style="text-shadow: 2px 2px 2px black"><span style="color: red; font-weight: bold;">W</span><span style="color: orange; font-weight: bold;">I</span><span style="color: yellow; font-weight: bold;">L</span><span style="color: green; font-weight: bold;">L</span><span style="color: blue; font-weight: bold;">O</span><span style="color: indigo; font-weight: bold;">W</span><span style="color: violet; font-weight: bold;">F</span><span style="color: red; font-weight: bold;">A</span><span style="color: orange; font-weight: bold;">G</span></span>';
                usertitles[i].innerHTML = 'Official Faggot';
            }
        }
    };

})();