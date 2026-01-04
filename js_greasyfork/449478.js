// ==UserScript==
// @name         不要自动连播
// @namespace    mscststs
// @version      0.1
// @description  关闭B站自动连播
// @author       mscststs
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449478/%E4%B8%8D%E8%A6%81%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/449478/%E4%B8%8D%E8%A6%81%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.localStorage["recommend_auto_play"] = "close"
})();