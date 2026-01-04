// ==UserScript==
// @name         QQ空间自动删除留言
// @description  一键删除QQ空间所有留言。不可恢复，慎用！
// @namespace    https://greasyfork.org/users/467205
// @version      0.0.1
// @author       Caster
// @license      Unlicense
// @match        *://user.qzone.qq.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/415996/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%95%99%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/415996/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E7%95%99%E8%A8%80.meta.js
// ==/UserScript==
'use strict'

addFloatButton('删除所有留言', async function () {
  this.loop = !this.loop
  const appIframe = document.querySelector('.app_canvas_frame')
  if (!appIframe) {
    const switchToTag = window.confirm('未切换到“留言”标签，是否立即切换？')
    if (switchToTag) {
      document.querySelector('.menu_item_334>a').click()
    } else {
      return
    }
  }

  await sleepAsync(2000)
  const iframeDocument = document.querySelector('.app_canvas_frame').contentWindow.document
  
  /**
   * 进入批量管理模式
   */
  const batchBtn = iframeDocument.querySelector('#btnBatch')
  batchBtn.setAttribute('ref', 'toggleBatchMode')
  batchBtn.click()
  
  while (this.loop) {
    /**
     * 全选
     */
    const checkAllBox = iframeDocument.querySelector('#chkSelectAll')
    checkAllBox.click()

    /**
     * 删除
     */
    const deleteBtn = iframeDocument.querySelector('#btnDeleteBatchBottom')
    deleteBtn.setAttribute('rel', 'batchDelete')
    deleteBtn.click()

    await sleepAsync(2000)
    clickAllEl('.qz_dialog_layer_sub')
    
    await sleepAsync(3000)
  }
})

function clickAllEl (selector, parentNode = document) {
  parentNode.querySelectorAll(selector).forEach(el => el.click())
}

async function sleepAsync (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function addFloatButton (text, onclick) {
  if (!document.addFloatButton) {
    const buttonContainer = document.body.appendChild(document.createElement('div')).attachShadow({ mode: 'open' })
    buttonContainer.innerHTML = '<style>:host{position:fixed;top:3px;left:3px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e5;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id=i type=checkbox><label for=i></label>'
    document.addFloatButton = (text, onclick) => {
      const button = document.createElement('button')
      button.textContent = text
      button.addEventListener('click', onclick)
      return buttonContainer.appendChild(button)
    }
  }
  return document.addFloatButton(text, onclick)
}
