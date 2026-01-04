// ==UserScript==
// @name         哔哩哔哩番剧播放器3.x cc字幕描边&背景透明
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  哔哩哔哩番剧播放器3.x不允许设置cc字幕样式，本脚本将其背景设置为透明并加上描边
// @author       Howard Wu
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant    GM_addStyle
// @run-at   document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437822/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E6%92%AD%E6%94%BE%E5%99%A83x%20cc%E5%AD%97%E5%B9%95%E6%8F%8F%E8%BE%B9%E8%83%8C%E6%99%AF%E9%80%8F%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/437822/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%95%AA%E5%89%A7%E6%92%AD%E6%94%BE%E5%99%A83x%20cc%E5%AD%97%E5%B9%95%E6%8F%8F%E8%BE%B9%E8%83%8C%E6%99%AF%E9%80%8F%E6%98%8E.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
GM_addStyle(`
    .squirtle-subtitle-item-text{
    background: rgba(0, 0, 0, 0) !important;
    text-shadow: rgb(0, 0, 0) 0 0 1px, rgb(0, 0, 0) 0 0 1px, rgb(0, 0, 0) 0 0 1px !important;
    }
`);
