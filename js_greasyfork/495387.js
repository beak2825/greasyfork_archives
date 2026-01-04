// ==UserScript==
// @name         Fix Bilibili Festival Video Document Title
// @namespace    http://ft2.club/
// @version      2024-05-18
// @description  show the information of the music when watching a video on Bilibili inside a festival
// @author       Sheng Fan
// @match        https://www.bilibili.com/festival/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495387/Fix%20Bilibili%20Festival%20Video%20Document%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/495387/Fix%20Bilibili%20Festival%20Video%20Document%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => { document.title = document.querySelector("#videoToolbar > div.video-toobar_title.video-toobar-title_indent").innerText; },200);

    // Your code here...
})();