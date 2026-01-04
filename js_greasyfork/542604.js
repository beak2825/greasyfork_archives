// ==UserScript==
// @name         Janitor AI - Stable Chat Width Fix
// @namespace    
// @version      5.1
// @description  Sets the chat textarea width to 1000px. (You can change it to fit your screen.)
// @author       ???
// @match        https://janitorai.com/chats/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/542604/Janitor%20AI%20-%20Stable%20Chat%20Width%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/542604/Janitor%20AI%20-%20Stable%20Chat%20Width%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        textarea[class*="_glassTextarea_"] {
            width: 1000px !important; // Change the width here. 
        }
    `);

    console.log("Janitor AI - Chat Width Fix has been applied.");
})();