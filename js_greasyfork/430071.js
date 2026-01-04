// ==UserScript==
// @name         yande.re download directly
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接下载图片
// @author       ayase
// @match        https://yande.re/post/show/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/430071/yandere%20download%20directly.user.js
// @updateURL https://update.greasyfork.org/scripts/430071/yandere%20download%20directly.meta.js
// ==/UserScript==



(async () => {
   const node = document.querySelector('.original-file-unchanged') || document.querySelector('#highres')
   if (!node) {
       return
   }
   const href = node.getAttribute('href')
   const fileName = decodeURI(href.split('/').pop()).replace('yande.re', '').trim()
   console.log(fileName);
   node.setAttribute('download', fileName)


   const resp = await fetch(href)
   const reader = new FileReader()
   reader.addEventListener('load', (evt) => {
       node.setAttribute('href', evt.currentTarget.result)
   })
   reader.readAsDataURL(await resp.blob())
})()