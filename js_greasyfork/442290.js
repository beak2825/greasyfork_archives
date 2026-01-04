// ==UserScript==
// @name         虎扑图片缩小
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2
// @description  虎扑帖子图片(楼中楼图)缩小至200px
// @author       https://github.com/gwokming
// @match        https://bbs.hupu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hupu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442290/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/442290/%E8%99%8E%E6%89%91%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==


(function() {
  'use strict'
  function addCSS(cssText) {
    var style = document.createElement('style') // 创建一个style元素
    var head = document.head || document.getElementsByTagName('head')[0] // 获取head元素
    style.type = 'text/css' // 这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
    if (style.styleSheet) { // IE
      var func = function() {
        try { // 防止IE中stylesheet数量超过限制而发生错误
          style.styleSheet.cssText = cssText
        } catch (e) {
          console.log(e)
        }
      }
      // 如果当前styleSheet还不能用，则放到异步中则行
      if (style.styleSheet.disabled) {
        setTimeout(func, 10)
      } else {
        func()
      }
    } else { // w3c
    // w3c浏览器中只要创建文本节点插入到style元素中就行了
      var textNode = document.createTextNode(cssText)
      style.appendChild(textNode)
    }
    head.appendChild(style) // 把创建的style元素插入到head中
  }
  // 图片缩小
  addCSS('.image-wrapper img.thread-img { width: 200px!important; height: auto!important; }')
  // 头部栏去掉
  addCSS('.gamecenter { display:none!important}')
})()
