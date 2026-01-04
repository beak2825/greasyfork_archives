// ==UserScript==
// @name        Inject jQuery
// @homepage    https://github.com/hxlhxl
// @icon        https://www.google.com/s2/favicons?sz=64&domain=jquery.com
// @version     1.0.4
// @description 向网站注入 jQuery 库
// @author      hxlhxl
// @source      forked from https://github.com/E011011101001/Twitter-Block-With-Love
// @license     MIT
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_log
// @grant       GM_xmlhttpRequest
// @match       *
// @namespace   https://greasyfork.org/users/1374450
// @downloadURL https://update.greasyfork.org/scripts/510712/Inject%20jQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/510712/Inject%20jQuery.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const msgPrefix = 'lib-provider ->'
  const log = function (...msgs) {
    console.warn(`${msgPrefix}`, ...msgs)
  }
  const jQueryLink =
    'https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js'
  // 检查 jQuery 是否已经存在
  // 在此之前，不要再 元数据中 使用 @require jquery.min.js, 否则 油猴脚本 中就有了 jQuery 了
  if (typeof jQuery === 'undefined') {
    // 创建一个新的 script 标签
    var script = document.createElement('script')
    script.src = jQueryLink
    script.onload = function () {
      log('jQuery provided')
    }

    // 将 script 标签添加到 document.head 中
    document.head.appendChild(script)
  } else {
    log('site has built-in jQuery')
  }
})()
