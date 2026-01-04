// ==UserScript==
// @name Abema 强制 1080p
// @description 把720p播放列表强制指向1080p
// @version 1.0.0
// @run-at document-start
// @namespace Violentmonkey Scripts
// @match https://abema.tv/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/375574/Abema%20%E5%BC%BA%E5%88%B6%201080p.user.js
// @updateURL https://update.greasyfork.org/scripts/375574/Abema%20%E5%BC%BA%E5%88%B6%201080p.meta.js
// ==/UserScript==
const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
    arguments[1] = arguments[1].replace('720/playlist.m3u8', '1080/playlist.m3u8')
    open.apply(this, arguments);
};