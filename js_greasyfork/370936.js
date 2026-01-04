// ==UserScript==
// @name         QQ空间自动删除说说
// @description  一键删除QQ空间所有说说。不可恢复，慎用！
// @namespace    https://greasyfork.org/users/197529
// @version      0.7.12
// @author       kkocdko
// @license      Unlicense
// @match        *://user.qzone.qq.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/370936/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%AF%B4%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/370936/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E8%AF%B4%E8%AF%B4.meta.js
// ==/UserScript==
'use strict'

addFloatButton('删除所有说说', async function () {
  this.loop = !this.loop
  const appIframe = document.querySelector('.app_canvas_frame')
  if (!appIframe) {
    const switchToTag = window.confirm('未切换到“说说”标签，是否立即切换？')
    if (switchToTag) {
      document.querySelector('.head-nav-menu>.menu_item_311>a').click()
    } else {
      return
    }
  }
  const iframeDocument = appIframe.contentWindow.document
  while (this.loop) {
    clickAllEl('.del_btn', iframeDocument)
    await sleepAsync(2000)
    clickAllEl('.qz_dialog_layer_sub')
    await sleepAsync(1500)
    nextPage()
    await sleepAsync(3000)
  }

  function nextPage () {
    iframeDocument.querySelectorAll('.mod_pagenav_main>a').forEach(el => {
      if (el.innerText === '下一页') {
        el.click()
      }
    })
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
