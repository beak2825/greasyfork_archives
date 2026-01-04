// ==UserScript==
// @name              Fix full-screen video colors glitch on macOS
// @name:en           Fix full-screen video colors glitch on macOS
// @name:zh           修复在 macOS 上全屏观看视频可能变黄的问题
// @name:zh-CN        修复在 macOS 上全屏观看视频可能变黄的问题
// @namespace         http://tampermonkey.net/
// @version           0.1
// @description       For macOS users. Fix visual color artifacts in full-screen videos on external monitor when the f.lux app of night shift is running.
// @description:en    For macOS users. Fix visual color artifacts in full-screen videos on external monitor in Chrome when the f.lux app of night shift is running.
// @description:zh-CN 适用于 macOS 系统。当 mac 外接显示器同时使用 f.lux 或者 夜览模式时，使用浏览器观看全屏观看视频，屏幕会变黄，此脚本将修复此问题。
// @author            nozomi22
// @license           MIT License
// @match             *://www.bilibili.com/video/*
// @match             *://www.youtube.com/*
// @match             *://www.netflix.com/*
// @grant             none
// @downloadURL https://update.greasyfork.org/scripts/398662/Fix%20full-screen%20video%20colors%20glitch%20on%20macOS.user.js
// @updateURL https://update.greasyfork.org/scripts/398662/Fix%20full-screen%20video%20colors%20glitch%20on%20macOS.meta.js
// ==/UserScript==

(function () {
    var style = document.createElement ("style");
//    style.appendChild (document.createTextNode (""));
    document.head.appendChild (style);
    var ss = style.sheet;
    ss.insertRule (":-webkit-full-screen video {opacity: 0.996 !important;}", 0);
    ss.insertRule (":fullscreen video {opacity: 0.996 !important;}", 0);
})();