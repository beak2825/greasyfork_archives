// ==UserScript==
// @name         Chat+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A Better chat for Bloxd.io!
// @author       Uoksisss
// @match        https://bloxd.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490394/Chat%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/490394/Chat%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function betterChat() {
    const chatMessages = document.querySelectorAll('.ChatMessages');
    const chatInput = document.querySelector('.ChatInput');

    const messageStyles = {
        color: '#fff',
        padding: '10px',
        borderRadius: '15px 0 15px 15px',
        borderTopLeftRadius: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)'
    };

    const inputStyles = {
        color: '#fff',
        padding: '10px',
        borderRadius: '5px 0 5px 5px',
        borderTopLeftRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)'
    };

    if (chatMessages.length > 0) {
        chatMessages.forEach((chatMessage) => {
            Object.assign(chatMessage.style, messageStyles);
        });
    }

    if (chatInput) {
        Object.assign(chatInput.style, inputStyles);
    }
}

setInterval(betterChat, 730)
})();