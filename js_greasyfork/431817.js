// ==UserScript==
// @name         Bilibili Jump
// @version      1.0.0
// @description  按k跳跃88s
// @namespace    bilibili_jump
// @author       u2shana
// @license      MIT
// @match        *://*.bilibili.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @icon         https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo-small.png
// @icon64       https://cdn.jsdelivr.net/gh/the1812/Bilibili-Evolved@preview/images/logo.png
// @downloadURL https://update.greasyfork.org/scripts/431817/Bilibili%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/431817/Bilibili%20Jump.meta.js
// ==/UserScript==

// 要跳跃的秒数
const jumpTime = 88
const supportedUrls = [
  'https://www.bilibili.com/bangumi/',
  'https://www.bilibili.com/video/',
]
if (supportedUrls.some(url => document.URL.startsWith(url))) {
  document.addEventListener('keydown', e => {
    if (document.activeElement && ['input', 'textarea'].includes(document.activeElement.nodeName.toLowerCase())) {
      return
    }
    if (e.key.toLowerCase() === 'k') {
      document.querySelector('video').currentTime += jumpTime
    }
  })
}