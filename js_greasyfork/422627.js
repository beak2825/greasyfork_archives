// ==UserScript==
// @name         微信读书注释提取 URL
// @namespace    https://github.com/shanyuhai123
// @version      0.1.1
// @description  从微信读书的注释中提取 URL，使其可点击跳转
// @author       shanyuhai123
// @match        https://weread.qq.com/web/reader/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422627/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%B3%A8%E9%87%8A%E6%8F%90%E5%8F%96%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/422627/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E6%B3%A8%E9%87%8A%E6%8F%90%E5%8F%96%20URL.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const observer = new MutationObserver(function () {
    document.querySelectorAll('.reader_footerNote_text').forEach(el => {
      const urlReg = /((https?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/img

      const template = url => `<a href="${url}" target="_blank">${url}</a>`

      el.innerHTML = el.textContent.replace(urlReg, (url) => template(url))
    })
  })
  const root = document.querySelector('body')
  const options = {
    childList: true
  }
  observer.observe(root, options)
})()
