// ==UserScript==
// @name         正常复制
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  正常复制内容
// @author       share121
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458534/%E6%AD%A3%E5%B8%B8%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/458534/%E6%AD%A3%E5%B8%B8%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

window.addEventListener(
  'copy',
  e => (e.stopImmediatePropagation?.(), e.stopPropagation(), !1),
  !0
)
