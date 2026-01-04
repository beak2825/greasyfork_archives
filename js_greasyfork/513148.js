// ==UserScript==
// @name               有谱么15秒解除
// @namespace      http://tampermonkey.net/
// @version             1.0.1
// @description      解除有谱么15秒非会员限制播放
// @author              Yize Yun
// @match              https://yopu.co/*
// @icon                  https://www.google.com/s2/favicons?sz=64&domain=yopu.co
// @grant                none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/513148/%E6%9C%89%E8%B0%B1%E4%B9%8815%E7%A7%92%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/513148/%E6%9C%89%E8%B0%B1%E4%B9%8815%E7%A7%92%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = (fn, duration, ...args) => (String(fn).includes('有声谱播放') ? void 0 : originalSetTimeout(fn, duration, ...args))
})();