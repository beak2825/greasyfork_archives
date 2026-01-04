// ==UserScript==
// @name         小黑盒自动跳转
// @author         firstchoice
// @description    小黑盒手机分享贴子自动跳转网页版
// @namespace    http://tampermonkey.net/
// @version      2025-2-20
// @description  try to take over the world!
// @author       Quo vadis
// @match        https://api.xiaoheihe.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoheihe.cn
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521287/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/521287/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let id = window.location.search.match("link_id=([0-9a-f]+)")[1];
    let base_url = "https://xiaoheihe.cn/app/bbs/link/";
    window.location.href = base_url+id;
})();