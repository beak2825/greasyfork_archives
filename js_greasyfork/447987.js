// ==UserScript==
// @name         my-plugin
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  供个人使用
// @author
// @match        my_work_website
// @downloadURL https://update.greasyfork.org/scripts/447987/my-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/447987/my-plugin.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (location.href === 'https://www.nothingboat.site/2young/js/') return
  var script = document.createElement('script')
  script.src = 'https://www.nothingboat.site/2young/js/app.bundle.js'
  document.body.appendChild(script)
})()