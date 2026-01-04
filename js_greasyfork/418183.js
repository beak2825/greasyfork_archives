// ==UserScript==
// @name         解锁AbemaTv&自动高清晰度
// @icon            https://abema.tv/favicon.ico?v=2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  请使用日本服务器访问。
// @author       mo
// @match        https://abema.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418183/%E8%A7%A3%E9%94%81AbemaTv%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/418183/%E8%A7%A3%E9%94%81AbemaTv%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==
(function() {
    Object.defineProperty ( window.__CLIENT_REGION__ ,'isAllowed', {
        get: () => true
    });
    Object.defineProperty ( window.__CLIENT_REGION__ ,'status', {
        get: () => false
    });
    const open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        arguments[1] = arguments[1].replace('*/playlist.m3u8', '1080/playlist.m3u8')
        open.apply(this, arguments);
    };
})();