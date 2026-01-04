// ==UserScript==
// @name         zhihu-helper
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  知乎目录
// @author       xx
// @match        https://zhuanlan.zhihu.com/*
// @match        https://www.zhihu.com/column/*
// @require https://unpkg.com/react@17/umd/react.production.min.js
// @require https://unpkg.com/react-dom@17/umd/react-dom.production.min.js

// @downloadURL https://update.greasyfork.org/scripts/421326/zhihu-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/421326/zhihu-helper.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (location.href === 'http://localhost:8080/') return
  var script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/gh/lemon031/zhihu-help/dist/app.bundle.js'
  document.body.appendChild(script)
})()
