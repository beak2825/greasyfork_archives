// ==UserScript==
// @name         zhihu-helper
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  this is test file of chrome plugin for zhihu
// @author       TimLie
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/column/*
// @require https://unpkg.com/vue@2.6.12/dist/vue.runtime.min.js

// @downloadURL https://update.greasyfork.org/scripts/421379/zhihu-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/421379/zhihu-helper.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (location.href === 'http://localhost:8080/') return
  var script = document.createElement('script')
  // script.src = 'http://localhost:8080/app.bundle.js'
  script.src = 'https://cdn.jsdelivr.net/gh/TimYao/cdn@1.0/wokoo/app.bundle.js'
  document.body.appendChild(script)
})()
