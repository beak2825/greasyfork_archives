// ==UserScript==
// @name b站直播间边缘特效关闭
// @description 关闭b站直播间右侧的22娘礼物特效和左侧的新年活动爆竹特效
// @author Hivol
// @namespace http://www.hasqo.cn
// @version 1.1.0
// @include *://live.bilibili.com/*
// @license MIT
// @supportURL http://www.hasqo.cn
// @grant None
// @downloadURL https://update.greasyfork.org/scripts/38088/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%BE%B9%E7%BC%98%E7%89%B9%E6%95%88%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/38088/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E8%BE%B9%E7%BC%98%E7%89%B9%E6%95%88%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.getElementById("my-dear-haruna-vm").style.display = "none";
    document.getElementById("spring-2018-section").style.display = "none";
})();