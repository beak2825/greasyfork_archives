// ==UserScript==
// @name             智慧教育平台视频跳过
// @name:en          Smartedu Video Skip
// @namespace        https://github.com/mike-unk/smartedu-video-skip
// @version          1.0.3
// @description      跳过国家中小学智慧教育平台的视频
// @description:en   A user.js that skips basic.smartedu.cn videos
// @author           mike-unk
// @match            https://basic.smartedu.cn/*
// @license          MIT
// @icon             https://basic.smartedu.cn/favicon.ico
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/486645/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/486645/%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{ let v = document.getElementsByTagName('video')[0]; v.currentTime = v.duration; }, 800);
})();
