// ==UserScript==
// @name         Torn Chat Linkification
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Make URLs in Torn Chat clickable
// @author       Klockwerk
// @match        https://www.torn.com/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/478067/Torn%20Chat%20Linkification.user.js
// @updateURL https://update.greasyfork.org/scripts/478067/Torn%20Chat%20Linkification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function linkify(text) {
        const urlPattern = /\b(https?:\/\/\S+|www\.\S+)/gi;
        return text.replace(urlPattern, url => {
            // If it's a "www." link, prepend with "http://"
            if (url.startsWith('www.')) {
                url = 'http://' + url;
            }
            return `<a href="${url}" target="_blank">${url}</a>`;
        });
    }

    // Check chat every 5 seconds, make links clickable
    setInterval(() => {
        // Find chat messages
        const chatMessages = document.querySelectorAll('.chat-box-body__message___BWRKj:not(.linkified)');

        chatMessages.forEach(message => {
            // Mark processed
            message.classList.add('linkified');
            message.innerHTML = linkify(message.innerHTML);
        });

    }, 5000);
})();
