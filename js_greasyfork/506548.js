// ==UserScript==
// @name         chatgpt 验证码
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  这个脚本旨在改善在 chatgpt.com 网站上的免费用户体验,包括自动移除可能出现的验证码，输入框回车时自动绕过烦人的验证码。
// @match        https://chatgpt.com/*
// @icon         https://www.freelogovectors.net/wp-content/uploads/2023/01/chatgpt-logo-freelogovectors.net_.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506548/chatgpt%20%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/506548/chatgpt%20%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let intervalId = ''
    let textarea = document.getElementById('prompt-textarea');



    // Function to remove the element if it exists
    function removeElement() {
        const element = document.getElementById('enforcement-containerchatgpt-freeaccount');
        if (element) {
            console.log('删除验证码元素');
            element.remove();
        } else {
            console.log('未找到验证码元素');
        }
    }

    // Function to simulate Enter key press
    function simulateEnterKeyPress() {
        const event = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
        });
      textarea.dispatchEvent(event);
    }

    // Function to check for the button and simulate Enter key if not present
    function checkButton() {
        const button = document.querySelector('button[data-testid="stop-button"]');
        if (button) {
            clearInterval(intervalId); // Stop the interval when the button is found
            intervalId = ''
        } else {
            simulateEnterKeyPress(); // Simulate Enter key press
        }
    }

    // Add an event listener to the textarea for 'keydown' events


     function bindEnterKeyEvent() {
        textarea = document.getElementById('prompt-textarea');
        console.log('textarea',textarea);
         if (textarea) {
             textarea.addEventListener('keydown', function(event) {
                 if (event.key === 'Enter' && !event.shiftKey) {
                     removeElement();
                     // Check for the button every 500 milliseconds
                     if (!intervalId) {
                         intervalId = setInterval(checkButton, 1000);
                     }
                 }
             });
        } else {
            console.log('Textarea not found.');
        }
    }

    // Function to handle navigation clicks
    function handleNavigationClick() {
        const navElement = document.querySelector('nav[aria-label="历史聊天记录"]');
        console.log(navElement);
        if (navElement) {
            navElement.addEventListener('click', function() {
                console.log('Navigated to history section, re-binding Enter key event.');
                setTimeout(function() {
                    bindEnterKeyEvent(); // Re-bind Enter key event after page is loaded
                }, 1000);
            });
        }
    }

        // Initial binding of Enter key event
    bindEnterKeyEvent();

    // Handle navigation clicks to re-bind Enter key event
     window.onload = function() {
        handleNavigationClick();
    };

})();