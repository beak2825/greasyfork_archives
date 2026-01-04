// ==UserScript==
// @name         不要翻译页面上的代码
// @namespace    http://floatsyi.com/
// @version      0.0.1
// @description  避免google网页翻译github站点中的代码
// @author       floatsyi
// @license      MIT
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/420066/%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/420066/%E4%B8%8D%E8%A6%81%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E4%B8%8A%E7%9A%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
;(function () {
  'use strict'
    const notranslate = (node) => void node.classList.add('notranslate')
    const pres = document.querySelectorAll('pre')
    pres.forEach(function (pre) {
      notranslate(pre)
    })
})