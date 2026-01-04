// ==UserScript==
// @name         115网盘快捷键修复
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  修复115网盘的快捷键功能。在网盘页面，Ctrl+/ 快捷键打开快捷键说明。macOS系统下，"打开传输"、"打开星标"、"打开云下载"、"快捷星标"需要使用 Control(即Ctrl) 代替 Alt，"全选"则应该为Command+A。
// @author       生瓜太保
// @match        https://115.com/*
// @icon         https://115.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542594/115%E7%BD%91%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/542594/115%E7%BD%91%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /*
  快捷键说明(Ctrl + /: 打开说明):

  C       : 重命名
  D       : 删除
  M       : 移动
  S       : 分享
  T       : 标签
  B       : 备注
  回车键   : 确定
  Esc     : 取消

  Alt + P : 打开传输 ⚠️ macOS: Ctrl + P
  Alt + I : 打开星标 ⚠️ macOS: Ctrl + I
  Alt + O : 打开云下载 ⚠️ macOS: Ctrl + O
  Alt + D : 快捷星标 ⚠️ macOS: Ctrl + D
  Ctrl + A : 全选 ⚠️ macOS: Command + A
  Shift + 单击 : 区域选择
  Alt + 单击 : 显示属性弹窗
  */

  // 页面加载完成后执行
  function injectVirtualElement() {
    // 如果已经存在，则不重复注入
    if (document.querySelector('#js-main_mode')) {
      return
    }

    // 查找新的容器元素
    const container = document.querySelector('#js_main_container')
    if (container) {
      // 创建虚拟导航元素
      const virtualNav = document.createElement('div')
      virtualNav.id = 'js-main_mode'
      virtualNav.style.display = 'none' // 隐藏元素

      // 添加必要的子元素
      virtualNav.innerHTML = `
        <a data-nav="file" class="hover"></a>
        <a data-nav="lately"></a>
      `

      // 将虚拟元素添加到容器中
      container.appendChild(virtualNav)
      console.log('115网盘快捷键修复：虚拟导航元素已注入')
    } else {
      // 如果容器尚未加载，设置一个短暂的延迟再次尝试
      setTimeout(injectVirtualElement, 1000)
    }
  }

  // 执行注入
  injectVirtualElement()
})()
