// ==UserScript==
// @name        Youtube调节默认播放速度
// @description Test
// @namespace Youtube
// @match       *://youtube.com/*
// @match       *://www.youtube.com/*
// @grant       Any
// @version     2.1
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/429396/Youtube%E8%B0%83%E8%8A%82%E9%BB%98%E8%AE%A4%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/429396/Youtube%E8%B0%83%E8%8A%82%E9%BB%98%E8%AE%A4%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6.meta.js
// ==/UserScript==

sessionStorage.setItem("yt-player-playback-rate", JSON.stringify({
    "data": "1.5",
    "creation": Date.now(),
}));