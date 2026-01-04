// ==UserScript==
// @name         BiliBili Dark Render 新版播放器的bug 修复
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修复Dark Render 在新版bilibili 播放器的bug
// @author       Akatsuki00
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449214/BiliBili%20Dark%20Render%20%E6%96%B0%E7%89%88%E6%92%AD%E6%94%BE%E5%99%A8%E7%9A%84bug%20%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/449214/BiliBili%20Dark%20Render%20%E6%96%B0%E7%89%88%E6%92%AD%E6%94%BE%E5%99%A8%E7%9A%84bug%20%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sending_bar = document.createElement('style');
    sending_bar.innerHTML = '.bpx-player-sending-bar{background-color:#181a1b;}'

    var inputbar_wrap = document.createElement('style');
    inputbar_wrap.innerHTML = '.bpx-player-video-inputbar-wrap{background-color:#34383a;border:1px solid #373c3e;color:#34383a}.bpx-player-sending-bar .bpx-player-video-inputbar{background:#f1f2f300}'
    document.body.appendChild(sending_bar);
    document.body.appendChild(inputbar_wrap);

})();