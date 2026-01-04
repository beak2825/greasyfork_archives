// ==UserScript==
// @name         Bilibili Link Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify Bilibili links to open in the current tab
// @author       ChatGPT(chat.openai.com)
// @match        *://*.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476211/Bilibili%20Link%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/476211/Bilibili%20Link%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify the link behavior
    function modifyLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.setAttribute('target', '_self');
        });
    }

    // Execute the function to modify the links
    modifyLinks();

    // Optionally, re-execute the function when new content is loaded into the page (like when scrolling)
    let lastHeight = document.body.clientHeight;
    setInterval(() => {
        if (document.body.clientHeight > lastHeight) {
            modifyLinks();
            lastHeight = document.body.clientHeight;
        }
    }, 1000);
})();
