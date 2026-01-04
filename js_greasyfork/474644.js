// ==UserScript==
// @name        禁用无限调试脚本debugger
// @namespace   debugger
// @match       *://*/*
// @grant       none
// @version     1.3
// @author      enjoysala
// @description 破解无限Debugger;禁用无限调试脚本debugger;
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474644/%E7%A6%81%E7%94%A8%E6%97%A0%E9%99%90%E8%B0%83%E8%AF%95%E8%84%9A%E6%9C%ACdebugger.user.js
// @updateURL https://update.greasyfork.org/scripts/474644/%E7%A6%81%E7%94%A8%E6%97%A0%E9%99%90%E8%B0%83%E8%AF%95%E8%84%9A%E6%9C%ACdebugger.meta.js
// ==/UserScript==
(function () {
    // 破解无限Debugger
    var constructorHook = constructor;
    Function.prototype.constructor = function(s) {
        if (s == "debugger") {
            return function() {}
        }
        return constructorHook(s);
    }
  const setInterval = window.setInterval;
  window.setInterval = function(fun, time) {
    // console.log(time, 'ddddd', fun.toString());
    if (fun && fun.toString) {
      var funString = fun.toString();
      if (funString.indexOf('debugger') > -1) return;
      if (funString.indexOf('window.close') > -1) return;
    }

    return setInterval(fun, time);
  }
})()