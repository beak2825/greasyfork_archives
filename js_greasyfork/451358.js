// ==UserScript==
// @name         百度翻译精简脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  去除百度翻译无用内容，保留主要翻译功能。
// @author       Loyal-Wind
// @match        https://fanyi.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/451358/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%B2%BE%E7%AE%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/451358/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91%E7%B2%BE%E7%AE%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
  'use strict'
GM_addStyle('#app-read{display:none !important}')
  const website = [
    {
        name: 'baidu',
        css: `
            .op-favo, .collection-btn, .correct-txt, .note-expand-btn, .navigation-wrapper, .domain-trans-wrapper, .header, .footer, .trans-other-right, .manual-trans-btn{display: none !important;}
        `
    }
  ]
  let url = window.location.href
  for (let i = 0; i < website.length; i++) {
    if (url.indexOf(website[i].name) !== -1) {
        return GM_addStyle(website[i].css)
    }
  }
})()