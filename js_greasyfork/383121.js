// ==UserScript==
// @name QQ空间相册批量下载
// @description 批量下载QQ空间相册
// @namespace Violentmonkey Scripts
// @match *://user.qzone.qq.com/*
// @grant none
// @version 0.0.1.20190929151404
// @downloadURL https://update.greasyfork.org/scripts/383121/QQ%E7%A9%BA%E9%97%B4%E7%9B%B8%E5%86%8C%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/383121/QQ%E7%A9%BA%E9%97%B4%E7%9B%B8%E5%86%8C%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

;(function() {
  function qzoneImageDownload() {
    if (!document.querySelector('.mod-photo-tool')){
        console.log('skip > '+window.location.href)
        return
    }
    console.log('run > '+window.location.href)
    var images = document.querySelectorAll('.j-pl-photoitem-img')
    var rawUrls = ''
    for (var i = 0; i < images.length; i++) {
      var src = images[i].src
      src = src.replace(/\/\/.*\.photo/, '//r.photo')
      src = src.replace(/\/m\//, '/r/')
      src = src.replace(/null&.*$/, '')
      rawUrls = rawUrls + '\n' + src
    }
    copyToClipboard(rawUrls)
  }

  function qzoneImageDownloadInit() {
    // 批量管理按钮
    var batchManageBtn = document.querySelector('.photo-op-item>a.j-pl-manage')
    if (!batchManageBtn) {
      return
    } else {
      batchManageBtn = batchManageBtn.parentNode
    }
    // 批量管理按钮后插入一个按钮
    var batchDownloadBtn = document.createElement('div')
    batchDownloadBtn.className = 'photo-op-item'
    batchDownloadBtn.innerHTML =
      '<a class="c-tx2 bg3 bor gb-btn-nor">下载当页</a>'
    batchManageBtn.parentNode.insertBefore(
      batchDownloadBtn,
      batchManageBtn.nextSibling
    )
    batchDownloadBtn.onclick = qzoneImageDownload
  }

  function copyToClipboard(text) {
    var textArea = document.createElement('textarea')
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2px'
    textArea.style.height = '2px'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      var successful = document.execCommand('copy')
      var successfulTip = '成功复制到剪贴板,请粘贴到迅雷进行批量下载。注意请确保页面拉到底部，本页所有照片都已加载出来！！！'
      var failTip = '该浏览器不支持点击复制到剪贴板'
      var msg = successful ? successfulTip : failTip
      alert(msg)
    } catch (err) {
      alert('该浏览器不支持点击复制到剪贴板')
    }
    document.body.removeChild(textArea)
  }
  window.addEventListener('load', qzoneImageDownloadInit, false)
})()