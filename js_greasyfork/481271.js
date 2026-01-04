// ==UserScript==
// @name         ChatGPT conversation full width
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Override default ChatGPT styles to have a wider conversation screen
// @author       Louis Lacoste
// @match             *://chat.openai.com
// @match             *://chat.openai.com/*
// @icon         https://cdn.oaistatic.com/_next/static/media/favicon-32x32.be48395e.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481271/ChatGPT%20conversation%20full%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/481271/ChatGPT%20conversation%20full%20width.meta.js
// ==/UserScript==

(function() {

    const style = document.createElement('style');

    style.type = 'text/css';

    style.innerText = `

.text-token-text-primary > div > div {
  max-width: 95% !important;
}

div[role="presentation"] > div:nth-child(2) > form {
  max-width: 75% !important;
}

`;

    document.head.appendChild(style);
})();