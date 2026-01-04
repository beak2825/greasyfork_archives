
// ==UserScript==
// @name         google-helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在新标签页直接打开google搜索的结果条目，避免从google跳转
// @author       ycz0926
// @match        https://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38123/google-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/38123/google-helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    document.body.addEventListener('mousedown', function (e) {
        var a = e.target;
        if (a.tagName != "A") return;
        if (a.target === '_blank') return;
        if (a.className == 'fl' || a.className == 'q qs' || a.className == '_VJq q qs t6psHzYPBsD__highlighted') return;
        if (a.parentNode.tagName == 'P') return;
        a.target = '_blank';
    });
})();