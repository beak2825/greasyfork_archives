// ==UserScript==
// @name         获取h5showVconsole
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  简单添加showVconsole的标识
// @author       You
// @match        *://*.com/v2/course/alive/*
// @match        *://*.com/v3/course/alive/*
// @match        *://*.com/v4/course/alive/*
// @match        *://*.cn/p/t/free/*
// @match        *://*.cn/v3/course/alive/*
// @match        *://*.cn/v4/course/alive/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Circle-icons-tools.svg/2048px-Circle-icons-tools.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512918/%E8%8E%B7%E5%8F%96h5showVconsole.user.js
// @updateURL https://update.greasyfork.org/scripts/512918/%E8%8E%B7%E5%8F%96h5showVconsole.meta.js
// ==/UserScript==

(function() {
    var hasShowConsoleType = window.location.href.includes("&showVconsole");
    if (!hasShowConsoleType) {
        window.location.href = "".concat(window.location.href, "&showVconsole");
    }
})();
