// ==UserScript==
// @name         Copy LeetCode Title
// @namespace    http://tampermonkey.net/
// @version      2025-05-17
// @description  Adds a button to copy the LeetCode problem title
// @author       You
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537470/Copy%20LeetCode%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/537470/Copy%20LeetCode%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }

    function addButton() {
        const titleElement = document.querySelector('.text-title-large');
        if (!titleElement) {
            console.error("Could not find the title element.");
            return;
        }

        const problemTitle = titleElement.textContent.trim();

        const copyButton = document.createElement('button');
        copyButton.textContent = '复制标题';
        copyButton.style.marginLeft = '10px'; // Add some spacing
        copyButton.style.padding = '5px 10px';
        copyButton.style.backgroundColor = '#f0f0f0';
        copyButton.style.border = '1px solid #ccc';
        copyButton.style.borderRadius = '5px';
        copyButton.style.cursor = 'pointer';

        copyButton.addEventListener('click', function() {
            copyToClipboard(problemTitle);
            // alert('标题已复制到剪贴板！'); // Provide feedback
        });

        const titleContainer = titleElement.parentNode;
        if (titleContainer) {
            titleContainer.appendChild(copyButton);
        } else {
            console.error("Could not find the title container.");
        }
    }

    // Add the button after the page loads
    window.addEventListener('load', addButton);
})();