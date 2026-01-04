// ==UserScript==
// @name         幻彩画笔newbing辅助脚本
// @namespace    plusv
// @version      1.1
// @description  幻彩画笔newbing辅助脚本,按tab键重置输入框，按ctrl键重置对话。
// @match        https://visionarybrush.com/aichat/newbing
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467402/%E5%B9%BB%E5%BD%A9%E7%94%BB%E7%AC%94newbing%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/467402/%E5%B9%BB%E5%BD%A9%E7%94%BB%E7%AC%94newbing%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the elements we need
    var textarea = document.getElementById("prompt"); // The textarea for typing questions
    var reset = document.getElementById("empty"); // The button for resetting the conversation

    // Add a keydown event listener to the document
    document.addEventListener("keydown", function(event) {
        // If the tab key is pressed
        if (event.key === "Tab") {
            // Prevent the default behavior of tab key
            event.preventDefault();
            // Focus on the textarea
            textarea.focus();
            // Select all the text in the textarea
            textarea.select();
            // Delete the selected text
            document.execCommand("delete");
        }
        // If the ctrl key is pressed
        if (event.key === "Control") {
            // Click on the reset button
            reset.click();
        }
    });
})();