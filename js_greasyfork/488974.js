// ==UserScript==
// @name         ChatGPT AutoEmotional prompt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Override default ChatGPT styles to have a wider conversation screen
// @author       Louis Lacoste
// @match             *://chat.openai.com
// @match             *://chat.openai.com/*
// @icon         https://cdn.oaistatic.com/_next/static/media/favicon-32x32.be48395e.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488974/ChatGPT%20AutoEmotional%20prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/488974/ChatGPT%20AutoEmotional%20prompt.meta.js
// ==/UserScript==


const message = "This is very important to my career, I'll tip 200$ for a perfect response.";
const textareaSelector = "#prompt-textarea";

window.addEventListener("keyup", function() {
    let textarea = document.querySelector(textareaSelector);
    let prompt = textarea.value;
    prompt = prompt.replace("/ea", message);
    textarea.value = prompt;
});

