// ==UserScript==
// @name         Button Clicker
// @namespace    https://chat.openai.com/chat
// @version      1
// @description  Clicks a button when you press Ctrl+Enter
// @match        https://chat.openai.com/chat
// @grant        none
// @license      Do What You Want
// @downloadURL https://update.greasyfork.org/scripts/462878/Button%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/462878/Button%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            var button = document.querySelector('button[class="absolute p-1 rounded-md text-gray-500 bottom-1.5 md:bottom-2.5 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent right-1 md:right-2"]');
            var rect = button.getBoundingClientRect();
            var x = rect.left + (rect.width / 2);
            var y = rect.top + (rect.height / 2);
            var event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            });
            button.dispatchEvent(event);
        }
    });
})();
