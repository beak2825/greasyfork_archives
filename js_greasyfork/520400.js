// ==UserScript==
// @name         去除有道在线翻译页面样式
// @namespace    小冰鸡
// @version      0.1
// @description  去除有道在线翻译最基础翻译功能外其他样式,保留最简洁的样式
// @author       小冰鸡
// @match        *://fanyi.youdao.com/*
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520400/%E5%8E%BB%E9%99%A4%E6%9C%89%E9%81%93%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/520400/%E5%8E%BB%E9%99%A4%E6%9C%89%E9%81%93%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E9%A1%B5%E9%9D%A2%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  function customFun() {
    let timer = setInterval(function () {
      let dom = document.querySelector('.tab-header')
      if (dom) {
        clearInterval(timer)

        dom.style.display = 'none'

        // 获取头部按钮列表,并且点击第一个
        let buttons = document.querySelectorAll('.tab-header .tab-item')
        buttons[0].click()

        // 要移除的dom类名列表
        let removeList = [
          '.ai-guide',
          '.sidebar-inner-container',
          '.header-content',
          '.top-banner-outer-container',
          '.banner-outer-container',
          '.document-upload-entrance-container',
          '.sidebar-container',
          '.dict-website-footer'
        ]
        removeList.forEach((domName) => {
          let dom = document.querySelector(domName)
          if (dom) dom.style.display = 'none'
        })
      }
      let dialog = document.querySelector('.pop-up-comp')
      if (dialog) {
        let ad = document.querySelector('.pop-up-comp .inner-content .ad')
        dialog.style.display = 'none'
      }
    }, 20)
  }
  customFun()
})()
