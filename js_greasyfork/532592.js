// ==UserScript==
// @name                字体优化
// @version             1.0.0
// @icon                  https://bkimg.cdn.bcebos.com/pic/9922720e0cf3d7ca5295046bf81fbe096b63a94f
// @description       雅黑建议设置#828282或#797979
// @author              wze
// @match               *://*/*
// @run-at               document-start
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @grant             GM_deleteValue
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @license           MIT
// @namespace https://greasyfork.org/users/1456747
// @downloadURL https://update.greasyfork.org/scripts/532592/%E5%AD%97%E4%BD%93%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532592/%E5%AD%97%E4%BD%93%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict'
  GM_addStyle(`
    html,body,* {
        text-shadow: 0px  0px   0.8px  #828282;
        -moz-osx-font-smoothing: grayscale;
    }
`)
})()