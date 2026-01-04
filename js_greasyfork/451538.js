// ==UserScript==
// @name         NGA你有毛病么
// @version      0.1
// @description  将各种乱七八糟nga连接转换为nga.178.com
// @author       Aront
// @match        *://*.nga.cn/*
// @match        *://*.ngabbs.com/*
// @match        *://*.ngacn.cc/*
// @icon         https://nga.178.com/favicon.ico
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/163117
// @downloadURL https://update.greasyfork.org/scripts/451538/NGA%E4%BD%A0%E6%9C%89%E6%AF%9B%E7%97%85%E4%B9%88.user.js
// @updateURL https://update.greasyfork.org/scripts/451538/NGA%E4%BD%A0%E6%9C%89%E6%AF%9B%E7%97%85%E4%B9%88.meta.js
// ==/UserScript==

function fuckNga(){
    var NgaUrl = "https://nga.178.com" + window.location.href.split(window.location.host)[1]
    window.location.href=NgaUrl
}

(function() {
        fuckNga()
}
)();