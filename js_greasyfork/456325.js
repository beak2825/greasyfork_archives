// ==UserScript==
// @name         站cool
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  站酷下载脚本!
// @author       maYunLaoXi
// @match        *://www.zcool.com.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456325/%E7%AB%99cool.user.js
// @updateURL https://update.greasyfork.org/scripts/456325/%E7%AB%99cool.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
  const urlMatch = /\/work\/.*\.html/
  const pushState = window.history.pushState
  window.history.pushState = function (...args) {
    console.log('pushState: ')
    console.log(args)
    pushState(...args)
    const [a, b, url] = args
    if (urlMatch.test(url)) {
      setTimeout(() => {
        getImg()
      }, 1000);
    }
  }
  const jszipDom = document.createElement('script')
  const fComDom = document.createElement('script')

  jszipDom.src = 'https://cdn.staticfile.org/jszip/3.10.1/jszip.min.js'
  fComDom.src = 'https://cdn.jsdelivr.net/npm/f-com@1.7.0/dist/f-com.min.js'

  document.body.appendChild(jszipDom)
  document.body.appendChild(fComDom)

  window.addEventListener('load', function() {
    console.log('window loaded')
    if(urlMatch.test(window.location.href)) getImg()
  }, false)
  function getImg() {
    console.log('监听到有图片页面， 注入下载代码')
    const titleDom = document.querySelector('h1[class="contentTitle"]')
    const authDom = document.querySelector('span[color="black3"][title]')
    const timeDom = document.querySelector('span[title*="最近更新时间"]')
    const hotDom = document.querySelector('span[title*="人气"]')

    const imgs = document.querySelectorAll('img[class*="photoImage"]')
  
    const srcs = []
  
    for (let img of imgs) {
      const dataSrc = img.getAttribute('data-src')
      if (dataSrc) srcs.push(dataSrc)
      else srcs.push(img.src)
    }
    // detailNavBox
    const dlBtn = document.createElement('div')
    dlBtn.classList.add('navItem')
    dlBtn.classList.add('detailItem')
    dlBtn.innerHTML = '下载'
  
    const detailNavBox = document.querySelector('.detailNavBox')
    detailNavBox.insertBefore(dlBtn, detailNavBox.childNodes[0])
  
    let dowloading = false
    dlBtn.onclick = () => {
      if (dowloading) {
        alert('正在下载')
        return
      }
      dowloading = true
      console.log(srcs)
      dlBtn.innerText = '下载中'

      const name = `${titleDom.innerText}-${authDom.innerText}`
      const content = `${titleDom.innerText}\n作者：${authDom.innerText}\n链接：${window.location.href}\n${timeDom.getAttribute('title')}\n${hotDom.getAttribute('title')}`
      const removeParams = !!JSON.parse(localStorage.getItem('greascript_zcool_removeParams'))

      fCom.dowloadZip({ src: srcs, JsZip: JSZip, fileName: `${name}.zip`, otherFiles: [{ fileName: `${name}.txt`, content }], removeParams }).then(() => {
        dlBtn.innerText = '下载'
        console.log('下载 successed')
        dowloading = false
      })
    }
  }
})();