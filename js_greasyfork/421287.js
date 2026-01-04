// ==UserScript==
// @name         MoveSearch
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  划词搜索技术类文章
// @author       shiwei.zhang
// @match        https://*/*
// @match        http://*/*

// @downloadURL https://update.greasyfork.org/scripts/421287/MoveSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/421287/MoveSearch.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (location.href === 'https://gitee.com/ShiweiZhang/zhufeng_plug-in-components_2102/tree/master/MoveSearch/dist') return
  var script = document.createElement('script')
  script.src = 'https://gitee.com/ShiweiZhang/zhufeng_plug-in-components_2102/tree/master/MoveSearch/dist/app.bundle.js'
  document.body.appendChild(script)
})()
