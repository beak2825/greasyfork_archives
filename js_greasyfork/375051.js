// ==UserScript==
// @name         Get Pigg Token
// @name:zh-CN   获取Pigg授权令牌
// @name:zh-TW   獲取Pigg授權令牌
// @namespace    http://ameba.jp/
// @version      0.1
// @description  Useful tool for you to get pigg token!
// @description:zh-cn  方便你快速获取Pigg的授权令牌!
// @description:zh-tw  方便你快速獲取Pigg的授權令牌!
// @author       PiggFans
// @homepage     https://pigg.ameba.jp/token
// @match        *://pigg.ameba.jp/token
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/375051/Get%20Pigg%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/375051/Get%20Pigg%20Token.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cookies = {};
    (document.cookie || '').split('; ').forEach(function(v){
        var kv = /([^=]+)=(.*)/.exec(v);
        if (kv) { cookies[kv[1]] = kv[2] }
    });

    if (!cookies.N) {
        return document.write('未检测到Ameba授权令牌，请确保您已登录Ameba');
    }
    if (!cookies.pigg) {
        return document.write('未检测到Pigg授权令牌，请确保您已登录Pigg');
    }

    GM_setClipboard(cookies.pigg, "text");
    document.write("<h2>复制Pigg授权令牌成功!</h2>");
    document.write("<p>如果失败，请双击下方的字符串，并按 Ctrl+C 复制：</p>");
    document.write("<p><i>" + cookies.pigg + "</i></p>");
})();