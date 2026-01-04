// ==UserScript==
// @name         Blankquote button
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Blank quote like a madman
// @author       Milan
// @match        *://*.websight.blue/thread/*
// @icon         https://lore.delivery/static/blueshi.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463625/Blankquote%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/463625/Blankquote%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const addButton = (message) => {
        const button = document.createElement("a");
        const quoteButton = [...message.getElementsByTagName('a')].filter(a=>a.href?.startsWith("https://lue.websight.blue/quote/"))[0];
        if(!!quoteButton) {
            button.href = quoteButton.href;
            const replyForm = document.getElementById("reply-form");
            button.onclick = (e)=> {
                e.preventDefault();
                quoteButton.onclick();
                replyForm.submit();
            }
            const buttonText = document.createTextNode("Blank quote");
            const seperator = document.createTextNode(" | ");
            message.appendChild(seperator);
            message.appendChild(button);
            button.appendChild(buttonText);
        }
    }
    document.querySelectorAll(".message-top").forEach(message=> addButton(message));
})();