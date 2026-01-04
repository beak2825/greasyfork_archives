// ==UserScript==
// @name         禁止百度QJ我剪贴板!
// @namespace    http://bmmmd.com/
// @version      0.4
// @description  禁止狗贼百度QJ我剪贴板!
// @author       bmm
// @match        https://*.baidu.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481454/%E7%A6%81%E6%AD%A2%E7%99%BE%E5%BA%A6QJ%E6%88%91%E5%89%AA%E8%B4%B4%E6%9D%BF%21.user.js
// @updateURL https://update.greasyfork.org/scripts/481454/%E7%A6%81%E6%AD%A2%E7%99%BE%E5%BA%A6QJ%E6%88%91%E5%89%AA%E8%B4%B4%E6%9D%BF%21.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const _writeText = window.navigator.clipboard.writeText;
    window.navigator.clipboard.writeText = function () {
        return "Fuck Robin Li";
    };

    const _execCommand = document.execCommand;
    document.execCommand = function () {
        if (arguments[0] == "copy") {
            return "Fuck Robin Li";
        }
        _execCommand.apply(this, arguments);
    };
    document.addEventListener("copy", (event) => {
        event.preventDefault();
    });
})();
