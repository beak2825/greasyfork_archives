// ==UserScript==
// @namespace    adach1
// @author       adach1
// @supportURL   https://github.com/Aadach1
// @name         选中复制
// @description  快速复制鼠标选中内容
// @version      1.5
// @include		 http://*
// @include		 https://*
// @include		 file:///*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/416427/%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/416427/%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

document.addEventListener('selectionchange', () => {
  let clipboard = window.getSelection().toString()
  if (!clipboard) return
  GM_setClipboard(clipboard, 'text')
})
