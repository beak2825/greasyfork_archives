// ==UserScript==
// @name        开启AI视频总结
// @namespace   cesar
// @match       https://www.bilibili.com/video/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant       none
// @version     1.0
// @license     MIT
// @author      cesaryuan
// @liscense    MIT
// @description 开启 bilibili 的 AI 视频总结功能
// @downloadURL https://update.greasyfork.org/scripts/478723/%E5%BC%80%E5%90%AFAI%E8%A7%86%E9%A2%91%E6%80%BB%E7%BB%93.user.js
// @updateURL https://update.greasyfork.org/scripts/478723/%E5%BC%80%E5%90%AFAI%E8%A7%86%E9%A2%91%E6%80%BB%E7%BB%93.meta.js
// ==/UserScript==
window.webAbTest.ab_version.ai_summary_version = 'SHOW';
window.webAbTest.ai_summary_version = 'SHOW';
window.__INITIAL_STATE__.abtest.ai_summary_version = 'SHOW';
