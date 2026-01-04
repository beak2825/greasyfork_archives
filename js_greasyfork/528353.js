// ==UserScript==
// @name         Limit Chat Messages of ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Keep only the last 10 conversation elements in ChatGPT chat
// @author       anothershm
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/528353/Limit%20Chat%20Messages%20of%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/528353/Limit%20Chat%20Messages%20of%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        const articles = document.querySelectorAll("article");

        if (articles.length > 10) {
            const articlesToDelete = Array.from(articles).slice(0, articles.length - 10); // Keep last 10
            articlesToDelete.forEach(article => article.remove());

            console.log(`Deleted ${articlesToDelete.length} old messages at ${new Date().toLocaleTimeString()}`);
        }
    }, 1 * 60 * 1000); // Runs every 5 minutes (300,000 ms)

})();
