// ==UserScript==
// @name         bob划词翻译
// @namespace    https://github.com/jqtmviyu/UserScripts
// @version      0.2
// @description  Show popup on text selection and trigger keyboard shortcut
// @author       jqtmviyu
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/527218/bob%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/527218/bob%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  let popup = null

  // 创建弹出提示
  function createPopup() {
    // console.log('创建弹出框')
    const div = document.createElement('div')
    div.textContent = 'B'
    div.style.cssText = `
            position: fixed;
            background: #333;
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            z-index: 10000;
            font-size: 14px;
        `
    return div
  }

  // 清理弹出框
  function cleanup() {
    // console.log('清理弹出框')
    if (popup && popup.parentNode) {
      popup.parentNode.removeChild(popup)
    }
  }

  // 监听选中文本事件
  document.addEventListener('mouseup', e => {
    // 如果弹出框存在，则清理弹出框
    cleanup()
    const selection = window.getSelection()
    const selectedText = selection.toString().trim() // 获取选中的文本并去除空白

    // 如果有选中文本
    if (selectedText) {
      // 创建新的弹出框
      popup = createPopup()
      document.body.appendChild(popup)

      // 设置弹出框位置
      const rect = selection.getRangeAt(0).getBoundingClientRect()
      popup.style.left = `${rect.right}px`
      popup.style.top = `${rect.top - 30}px`

      // 点击弹出框发送请求
      popup.addEventListener('mouseup', e => {
        e.preventDefault() // 阻止默认行为
        e.stopPropagation() // 阻止事件冒泡
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://localhost:8081/translate',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({ data: selectedText }),
          onload: function (response) {
            console.log('翻译请求已发送')
          },
          onerror: function (error) {
            console.error('请求失败:', error)
          },
        })
        cleanup()
      })

      // 阻止 popup 的 mouseup 事件冒泡
      popup.addEventListener('mousedown', e => {
        e.preventDefault() // 阻止默认行为
        e.stopPropagation() // 阻止 mouseup 事件冒泡
      })
    }
  })
})()
