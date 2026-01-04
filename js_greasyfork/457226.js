// ==UserScript==
// @name         hosts复制助手，Extract IPv4 Address from ipaddress.com
// @namespace    https://freysu.github.io/
// @version      0.2
// @description  hosts复制助手，快速把对应的网址的ipv4地址复制到剪贴板
// @description:en  This is a tool to extract IPv4 Address from ipaddress.com
// @author       FreySu
// @match        *://*.ipaddress.com/site/*
// @icon         https://icons.duckduckgo.com/ip2/ipaddress.com.ico
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/457226/hosts%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B%EF%BC%8CExtract%20IPv4%20Address%20from%20ipaddresscom.user.js
// @updateURL https://update.greasyfork.org/scripts/457226/hosts%E5%A4%8D%E5%88%B6%E5%8A%A9%E6%89%8B%EF%BC%8CExtract%20IPv4%20Address%20from%20ipaddresscom.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  GM_registerMenuCommand('复制ipv4地址到剪贴板［hosts格式］(Extract All address to the clipboard)', function () {
    main()
  })
  function main() {
    var domainUrl = ''
    var firstSearchNodeArr = document.querySelectorAll('.box table tbody th')
    for (let i of firstSearchNodeArr) {
      if (i.innerText === 'Domain') {
        domainUrl = i.nextElementSibling.innerText
        break
      }
    }
    if(!domainUrl.length){
        domainUrl = new URL(location.href).pathname.split("/")[2]
    }
    var text = ''
    for (let i of document.querySelector('.map-container .comma-separated')
      .childNodes) {
      text += `${i.innerText} ${domainUrl}\n`
    }
    try {
      text.length && GM_setClipboard(text.substring(0,text.length-1))
      text.length && alert(`所有的ipv4地址已复制!\nAll IP address are copied to the clipboard.\nResult:\n---\n${text.substring(0,text.length-1)}\n---`)
    } catch (e) {
      console.error(e.message)
      return alert('抱歉！遇到了错误！请手动复制！\nSorry! I encountered a problem! Please manually copy!')
    }
  }
})()
