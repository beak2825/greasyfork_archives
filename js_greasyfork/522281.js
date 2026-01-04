// ==UserScript==
// @name            remove-debugger
// @namespace       https://github.com/pansong291/
// @version         0.0.2
// @description     移除 eval 和 Function 中的 debugger 语句
// @author          paso
// @license         Apache-2.0
// @match           *://*/*
// @icon
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/522281/remove-debugger.user.js
// @updateURL https://update.greasyfork.org/scripts/522281/remove-debugger.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const oEval = window.eval
  const oFunction = window.Function
  const handleArgs = (args, last) => {
    if (!args?.length) return
    const ind = last ? args.length - 1 : 0
    if (!args[ind]?.replaceAll) return
    args[ind] = args[ind].replaceAll(/\bdebugger\b/g, ';/*debugger*/;')
  }
  window._original_eval = oEval
  window._original_Function = oFunction
  window.eval = new Proxy(oEval, {
    apply(target, thisArg, argArray) {
      handleArgs(argArray, false)
      return target.apply(thisArg, argArray)
    }
  })
  window.Function = new Proxy(oFunction, {
    apply(target, thisArg, argArray) {
      handleArgs(argArray, true)
      return target.apply(thisArg, argArray)
    },
    construct(target, argArray, newTarget) {
      handleArgs(argArray, true)
      return new target(...argArray)
    }
  })
  oFunction.prototype.constructor = window.Function
}())
