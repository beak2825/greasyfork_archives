// ==UserScript==
// @name         NGA图片一键提取
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  提取当前nga帖子已加载的页面里的图片
// @license      MIT
// @author       mfcwebfe
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/448261/NGA%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/448261/NGA%E5%9B%BE%E7%89%87%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

;(function () {
  // 'use strict';
  let imagesUrl = []
  let navList = document.querySelectorAll('.nav')
  if (navList.length > 0) {
    let nav = navList[0],
      before = nav.querySelectorAll('.clear')
    console.log(nav, before)
    let btn = document.createElement('a')
    btn.href = '#'
    btn.className = 'nav_link'
    btn.innerHTML = '图&nbsp;片&nbsp;提&nbsp;取'
    btn.onclick = () => {
      let imgs = document.querySelectorAll('img[data-srclazy]')
      console.log('img', imgs)
      if (imgs.length > 0) {
        imgs.forEach(item => {
          let url = ''
          if (item.src && item.src !== 'about:blank') {
            url = item.src
          } else if (item.dataset.srclazy) {
            url = item.dataset.srclazy
          } else {
            return
          }
          imagesUrl.push(url)
        })
        downloadImg()
      }
    }
    nav.insertBefore(btn, before[0])
  }
  //图片下载引用至这位老哥的脚本https://greasyfork.org/zh-CN/scripts/423084-nga-%E5%9B%BE%E7%89%87%E6%B5%8F%E8%A7%88%E5%99%A8
  const downloadImg = (blob = null, { list, filename } = {}) => {
    if (blob && filename) downloadBlobFile(blob, filename)
    const [first, ...newList] = list || imagesUrl
    if (!first) return
    const f = first.split('/').pop()
    ajaxDownload(first, downloadImg, { list: newList, filename: f })
  }

  const ajaxDownload = (url, callback, args, tryTimes = 0) => {
    const GM_download = GM.xmlHttpRequest || GM_xmlHttpRequest
    const clearUrl = url.replace(/[&\?]?download_timestamp=\d+/, '')
    const retryUrl = clearUrl + (clearUrl.indexOf('?') === -1 ? '?' : '&') + 'download_timestamp=' + new Date().getTime()
    GM_download({
      method: 'GET',
      responseType: 'blob',
      url: url,
      onreadystatechange: responseDetails => {
        if (responseDetails.readyState === 4) {
          if (responseDetails.status === 200 || responseDetails.status === 304 || responseDetails.status === 0) {
            const blob = responseDetails.response
            const size = blob && blob.size
            if (size && size / 1024 >= 5) {
              callback(blob, args)
            } else if (tryTimes++ === 3) {
              callback(blob, args)
            } else {
              ajaxDownload(retryUrl, callback, args, tryTimes)
            }
          } else {
            if (tryTimes++ === 3) {
              callback(null, args)
            } else {
              ajaxDownload(retryUrl, callback, args, tryTimes)
            }
          }
        }
      },
      onerror: responseDetails => {
        if (tryTimes++ === 3) {
          callback(null, args)
        } else {
          ajaxDownload(retryUrl, callback, args, tryTimes)
        }
        console.log(responseDetails.status)
      },
    })
  }

  const downloadBlobFile = (content, fileName) => {
    if ('msSaveOrOpenBlob' in navigator) {
      navigator.msSaveOrOpenBlob(content, fileName)
    } else {
      const aLink = document.createElement('a')
      aLink.download = fileName
      aLink.style = 'display:none;'
      const blob = new Blob([content])
      aLink.href = window.URL.createObjectURL(blob)
      document.body.appendChild(aLink)
      if (document.all) {
        aLink.click()
      } else {
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', true, true)
        aLink.dispatchEvent(evt)
      }
      window.URL.revokeObjectURL(aLink.href)
      document.body.removeChild(aLink)
    }
  }
})()
