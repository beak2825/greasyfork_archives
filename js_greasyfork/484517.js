// ==UserScript==
// @name         ReplyPing Off
// @namespace    http://tampermonkey.net/
// @version      2024-01-10
// @description  set Discord reply-ping to Off by default
// @author       Adam Scherlis
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484517/ReplyPing%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/484517/ReplyPing%20Off.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.addEventListener('mouseup', event => { // Whenever user finishes clicking...
        if (event.target.closest('div[aria-label*="Reply"]') !== null) { // if they clicked on the reply symbol or any of its children ...
            setTimeout(() => {

                let $ = document.querySelector('div[class*="mentionButton"]'); // try to get ping switch in reply box.
                if ($ !== null) { // If it exists,
                    if ($.parentElement.matches('[aria-checked="true"]')) { // and is On,
                        $.click(); // turn it Off.
                    }
                }

            }, 10); // If script doesn't work, try increasing this number (delay time in milliseconds) to 100.
        }
    });
})();