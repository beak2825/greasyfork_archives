// ==UserScript==
// @name         Bilibili清空消息记录
// @description  清空回复、艾特记录、消息或私信。不可恢复，慎用！
// @namespace    https://greasyfork.org/users/197529
// @version      0.3.6
// @author       kkocdko
// @license      Unlicense
// @match        *://message.bilibili.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/384886/Bilibili%E6%B8%85%E7%A9%BA%E6%B6%88%E6%81%AF%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/384886/Bilibili%E6%B8%85%E7%A9%BA%E6%B6%88%E6%81%AF%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==
'use strict'

addFloatButton('清空回复', () => clickAllEl('.reply-item .bl-button--primary'))
addFloatButton('清空艾特记录', () => clickAllEl('.at-item .bl-button--primary'))
addFloatButton('清空我的消息', () => clickAllEl('.close-icon'))
addFloatButton('清空私信存档', () => clickAllEl('.popup-btn-ctnr>.bl-button--primary'))

function clickAllEl (selector, parentNode = document) {
  parentNode.querySelectorAll(selector).forEach(el => el.click())
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
