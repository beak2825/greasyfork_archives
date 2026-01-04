// ==UserScript==
// @name         背景图片屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽背景
// @author       tai-zhou
// @match         *://*/*
// @run-at       document-start
// @grant        none
// @license      monsm
// @downloadURL https://update.greasyfork.org/scripts/455268/%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/455268/%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.style.cssText = "background-image:none!important;"
})();