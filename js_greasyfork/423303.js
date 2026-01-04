// ==UserScript==
// @name         哔哩哔哩（bilibili）简单粗暴屏蔽评论
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  try to take over the world!
// @author       kylin
// @match        *://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423303/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%EF%BC%89%E7%AE%80%E5%8D%95%E7%B2%97%E6%9A%B4%E5%B1%8F%E8%94%BD%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/423303/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%EF%BC%89%E7%AE%80%E5%8D%95%E7%B2%97%E6%9A%B4%E5%B1%8F%E8%94%BD%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("div.common").style.display="none";
})();