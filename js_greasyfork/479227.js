// ==UserScript==
// @license MIT
// @name         屏蔽文心一言debugger的神器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  让你可以调试文心一言不让debugger的插件
// @author       xumengzi
// @match        https://yiyan.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/479227/%E5%B1%8F%E8%94%BD%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80debugger%E7%9A%84%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479227/%E5%B1%8F%E8%94%BD%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80debugger%E7%9A%84%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apply = Function.prototype.apply;
    Function.prototype.apply = function (thisArg, argsArray = []) {
        if (this.toString() === 'function anonymous(\n) {\ndebugger\n}') {
            return;
        }
        return this.call(thisArg, ...argsArray);
    };
})();