// ==UserScript==
// @name         Hide reply box
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides reply area until you press `
// @author       Milan
// @match        http*://lue.websight.blue/thread/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463624/Hide%20reply%20box.user.js
// @updateURL https://update.greasyfork.org/scripts/463624/Hide%20reply%20box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const replyArea = document.getElementById("reply-area");
    replyArea.style.display = "none";

    const inputElement = document.getElementById("reply-content");

    const quoteLinks = document.querySelectorAll("a[href*=quote]");
    Array.prototype.map.call(quoteLinks, quoteLink => {
        const quoting = quoteLink.onclick;
        quoteLink.onclick = (e) => {
            e.preventDefault();
            quoting();
            replyArea.style.display = "block";
            inputElement.focus();
        }
    });

    document.addEventListener('keydown', function(e) {
        if(e.code == "Backquote") {
            replyArea.style.display = "block";
            inputElement.focus();
        }
    });
})();