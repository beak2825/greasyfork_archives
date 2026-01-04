// ==UserScript==
// @name         如何更好的为工作做贡献
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  帮助你更好的为工作做贡献
// @author       AT
// @match        https://*/*
// @match        http://*/*
// @icon         https://raw.githubusercontent.com/Sean529/at-image/main/contribution_favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @license      MIT
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/447787/%E5%A6%82%E4%BD%95%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B8%BA%E5%B7%A5%E4%BD%9C%E5%81%9A%E8%B4%A1%E7%8C%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/447787/%E5%A6%82%E4%BD%95%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B8%BA%E5%B7%A5%E4%BD%9C%E5%81%9A%E8%B4%A1%E7%8C%AE.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  $(document).ready(function () {
    setTimeout(() => {
      const title = $(document).attr('title')
      console.log(
        '%c AT 🥝 title 🥝-19',
        'font-size:13px; background:#de4307; color:#f6d04d;',
        title,
      )
      if (title?.includes('面试')) {
        const newTitle = title.replace(/面试/g, '做贡献')
        $(document).attr('title', newTitle)
      }
    }, 1000)
  })
})()
