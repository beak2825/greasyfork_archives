// ==UserScript==
// @name           去掉掘金WEBP
// @version        1.1.0
// @author         心满
// @namespace      心满
// @description    将掘金文章的webp图片转换为jpg格式的base64，用于Onenote剪辑保存，解决剪藏图片不显示的问题.
// @icon           https://b-gold-cdn.xitu.io/favicons/v2/favicon-32x32.png
// @include        *://juejin.im/post/*
// @downloadURL https://update.greasyfork.org/scripts/401911/%E5%8E%BB%E6%8E%89%E6%8E%98%E9%87%91WEBP.user.js
// @updateURL https://update.greasyfork.org/scripts/401911/%E5%8E%BB%E6%8E%89%E6%8E%98%E9%87%91WEBP.meta.js
// ==/UserScript==

setInterval(() => {
  [...document.getElementsByTagName('img')].forEach(v => {
    if (v.dataset.src && /webp/.test(v.src) && !v.dataset.covered) {
      const targetUrl = v.dataset.src.replace(/webp/g, 'jpg')
      getImgBase64Url(targetUrl).then(([baseUrl]) => {
        if (baseUrl) {
          v.src = baseUrl
          v.dataset.covered = '1'
        }
      })
    }
    if (v.dataset.src && !/webp/.test(v.src) && /imageslim/.test(v.src) && !v.dataset.covered) { // gif
      getImgBase64Url(v.dataset.src).then(([baseUrl]) => {
        if (baseUrl) {
          v.src = baseUrl
          v.dataset.covered = '1'
        }
      })
    }
  })
}, 1000)

function getImgBase64Url(imgUrl) {
  return new Promise(((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('get', imgUrl, true)
    xhr.responseType = 'blob'
    xhr.onload = function() {
      if (this.status == 200) {
        const blob = this.response
        console.log('blob', blob)
        const oFileReader = new FileReader()
        oFileReader.onloadend = function(e) {
          const base64 = e.target.result
          resolve([base64, undefined])
        }
        oFileReader.readAsDataURL(blob)
        const url = (window.URL || window.webkitURL).createObjectURL(blob)
        // resolve([url, undefined])
      }
    }
    xhr.onerror = function(e) { resolve([undefined, e]) }
    xhr.ontimeout = function(e) { resolve([undefined, e]) }
    xhr.send()
  }))
}
