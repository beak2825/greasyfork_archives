// ==UserScript==
// @name         FuckYou-leetcode.cn
// @namespace    http://my-unique-space
// @version      0.1
// @description  从 leetcode.cn 强制跳转回 leetcode.com。
// @author       ultrasev
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @match        https://leetcode.cn/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488247/FuckYou-leetcodecn.user.js
// @updateURL https://update.greasyfork.org/scripts/488247/FuckYou-leetcodecn.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.location.replace("https://leetcode.com");
})();
