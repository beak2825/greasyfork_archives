// ==UserScript==
// @name         98手机网页版复制代码增强
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  解决98手机网页版复制代码只复制第一行问题
// @author       bbbyqq
// @match        *://*/forum.php?mod=viewthread*
// @license      bbbyqq
// @downloadURL https://update.greasyfork.org/scripts/493241/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/493241/98%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict'

  document.querySelectorAll('.blockbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-clipboard-target')
      const code = []
      document.querySelector(id).parentNode.querySelectorAll('li').forEach(item => {
        code.push(item.innerText)
      })
      const codeText = code.join('\n')
      setTimeout(() => {
        copyContent(codeText)
      }, 500)
    })
  })

  function copyContent (text) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

})()
