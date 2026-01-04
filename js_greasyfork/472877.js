// ==UserScript==
// @name         Greasy Fork评论区净化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解决greasyfork上的垃圾评论刷屏问题
// @author       hellopo
// @match        *://greasyfork.org/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472877/Greasy%20Fork%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/472877/Greasy%20Fork%E8%AF%84%E8%AE%BA%E5%8C%BA%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 请将🐒的用户id或者昵称填写至下方的userID中
    const userID = ['1145294','丛林寻宝儿儿'];
    const userLinks = Array.from(document.getElementsByClassName("user-link"));
    for (let userLink of userLinks) {
        if (userID.some(id => userLink.href.includes(id)||userLink.textContent.includes(id))) {
            userLink.closest(".discussion-list-container")?.remove();
            userLink.closest(".comment")?.remove();
        }
    }
})();