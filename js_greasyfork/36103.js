// ==UserScript==
// @name         阳光宽频网自动跳转至西瓜视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阳光视频网自动跳转至西瓜视频
// @author       hunao.me
// @match        *.365yg.com/*
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/36103/%E9%98%B3%E5%85%89%E5%AE%BD%E9%A2%91%E7%BD%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%B3%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/36103/%E9%98%B3%E5%85%89%E5%AE%BD%E9%A2%91%E7%BD%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E8%87%B3%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var temp_href = window.location.href;
    window.location.href=temp_href.replace("365yg","ixigua");
})();