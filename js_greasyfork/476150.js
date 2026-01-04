// ==UserScript==
// @name         QQ空间自动删除主页内容
// @description  一键删除QQ空间主页内容。不可恢复，慎用！
// @version      0.0.2
// @author       ListeningLTG
// @license      Unlicense
// @match        *://user.qzone.qq.com/*
// @noframes
// @namespace https://greasyfork.org/users/239917
// @downloadURL https://update.greasyfork.org/scripts/476150/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E4%B8%BB%E9%A1%B5%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/476150/QQ%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E4%B8%BB%E9%A1%B5%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
'use strict'
var appIframe=null,iframeDocument=null
addFloatButton('删除所有主页内容', async function () {
  this.loop = !this.loop
  appIframe = document.querySelector('#QM_Feeds_Container>#QM_Feeds_Iframe')
    const qzGrid=document.querySelector('#pageContent')
  if (!appIframe||window.getComputedStyle(qzGrid).display=='none') {
    const switchToTag = window.confirm('未切换到“主页”标签，是否立即切换？')
    if (switchToTag) {
      document.querySelector('.head-nav-menu>.menu_item_N1>a').click()
    } else {
      return
    }
      return
  }
  iframeDocument = appIframe.contentWindow.document
  while (this.loop) {
     clickEl('.arrow-down', iframeDocument)
     clickAllEl('.qz_fop_delete', iframeDocument)
     clickAllEl('.item', iframeDocument)
    await sleepAsync(2000)
    clickAllEl('.qz-dark-button')
    await sleepAsync(1500)
    nextPage()
    await sleepAsync(3000)
  }

  function nextPage () {
      const btnMore= iframeDocument.querySelector('.data_btn_more')
      if(btnMore&&window.getComputedStyle(btnMore).display!='none'){
              btnMore.click()
      }
      const btnNoMore= iframeDocument.querySelector('.data_no_more')
      if(btnNoMore&&window.getComputedStyle(btnNoMore).display=='block'){
        document.querySelector('#QM_Feeds_Container>#QM_Feeds_Iframe').contentWindow.location.reload();
        appIframe = document.querySelector('#QM_Feeds_Container>#QM_Feeds_Iframe')
        iframeDocument = appIframe.contentWindow.document
      }

  }
})

function clickAllEl (selector, parentNode = document) {
  parentNode.querySelectorAll(selector).forEach(el => el.click())
}

function clickEl (selector, parentNode = document) {
  parentNode.querySelector(selector)&&parentNode.querySelector(selector).dispatchEvent(new MouseEvent('mouseover', { 'bubbles': true }));
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
