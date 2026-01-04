// ==UserScript==
// @name         Forumhouse Style Wide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Увеличивает область веток форума на всю ширину экрана
// @author       You
// @match        https://www.forumhouse.ru/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404943/Forumhouse%20Style%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/404943/Forumhouse%20Style%20Wide.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("pageWidth")[0].style.maxWidth = "100%";
    // Your code here...
})();