// ==UserScript==
// @name         Disable MS TODO Ctrl + s hotkeys
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2024-07-01
// @description  屏蔽Microsoft TODO 页面 Ctrl + S 事件
// @author       You
// @match        https://to-do.live.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://to-do.live.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499340/Disable%20MS%20TODO%20Ctrl%20%2B%20s%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/499340/Disable%20MS%20TODO%20Ctrl%20%2B%20s%20hotkeys.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            console.log('Ctrl + S 被屏蔽了!');
        }
    });
    // Your code here...
})();