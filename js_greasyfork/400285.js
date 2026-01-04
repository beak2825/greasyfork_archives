// ==UserScript==
// @name         godfield.net Chinese Translate
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  make godfield.net to Chinese.
// @supportURL   https://gitee.com/skydog/god-field-skydog-plugin
// @author       237th,meameasuki
// @match        *://godfield.net/*
// @resource outJson http://skydog.gitee.io/god-field-skydog-plugin/cn.json
// @grant           GM_getResourceText
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/400285/godfieldnet%20Chinese%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/400285/godfieldnet%20Chinese%20Translate.meta.js
// ==/UserScript==

const myOut = GM_getResourceText("outJson");


(function () {
  'use strict'
  function hook(object, attr) {
    var func = object[attr]
    object[attr] = function () {
      console.log('hooked', object, attr)
      var org_str = arguments[0];
      if (org_str.substr(0,6) == '{"item'){
        arguments[0] = myOut
      }
      var ret = func.apply(object, arguments)
      return ret
    }
  }
  hook(JSON, 'parse')
})()
