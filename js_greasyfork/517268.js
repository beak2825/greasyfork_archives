// ==UserScript==
// @name         WXYY Crack Debugger
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  备份脚本
// @author       You
// @match        https://yiyan.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/517268/WXYY%20Crack%20Debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/517268/WXYY%20Crack%20Debugger.meta.js
// ==/UserScript==

const apply = Function.prototype.apply
Function.prototype.apply = function (thisArg, argsArray=[]) {
    if(this.toString()==='function anonymous(\n) {\ndebugger\n}'){
        return
    }
    return this.call(thisArg, ...argsArray)
}