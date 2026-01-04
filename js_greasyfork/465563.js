// ==UserScript==
// @name         Hide/Show List on OpenAI Chat(隐藏/显示gpt聊天列表）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a button to show/hide custom CSS on OpenAI Chat page
// @author       Your name here
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465563/HideShow%20List%20on%20OpenAI%20Chat%28%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BAgpt%E8%81%8A%E5%A4%A9%E5%88%97%E8%A1%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/465563/HideShow%20List%20on%20OpenAI%20Chat%28%E9%9A%90%E8%97%8F%E6%98%BE%E7%A4%BAgpt%E8%81%8A%E5%A4%A9%E5%88%97%E8%A1%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define your custom CSS selector here
    var customCSS = '.w-full > .overflow-x-hidden:first-of-type { display: none; }';

    // Retrieve the stored state from local storage
    var isListHidden = localStorage.getItem('isListHidden') === 'true';

    // Create a button and append it to the body
    var btn = document.createElement('button');
    btn.textContent = isListHidden ?  's' : 'h';
    btn.style.position = 'fixed';
    btn.style.bottom = '10px';
    btn.style.right = '10px';
    document.body.appendChild(btn);

    // Apply the initial state based on the stored value
    var targetElement = document.querySelector('.w-full > .overflow-x-hidden:first-of-type');
    targetElement.style.display = isListHidden ? 'none' : '';

    // When the button is clicked
    btn.addEventListener('click', function() {
        // Toggle the state
        isListHidden = !isListHidden;

        // Update the stored state in local storage
        localStorage.setItem('isListHidden', isListHidden);

        // Toggle the visibility of the target element
        targetElement.style.display = isListHidden ? 'none' : '';

        // Toggle the button text
        btn.textContent = isListHidden ? 's' : 'h';
    });
})();
