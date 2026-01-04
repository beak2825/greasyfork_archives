// ==UserScript==
// @name         修身学堂整页下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://gdslzstsg.superlib.libsou.com/node/409.jspx*
// @grant        GM_download
// @connect      http://photoapps.yd.chaoxing.com/*
// @downloadURL https://update.greasyfork.org/scripts/404857/%E4%BF%AE%E8%BA%AB%E5%AD%A6%E5%A0%82%E6%95%B4%E9%A1%B5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/404857/%E4%BF%AE%E8%BA%AB%E5%AD%A6%E5%A0%82%E6%95%B4%E9%A1%B5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const head = document.getElementsByTagName('head');
  head[0].insertAdjacentHTML('beforeend', `<style type="text/css">
.hx-download-the-page{
font-size:16px;
line-height:30px;
color:#999;
    cursor: pointer;
user-select:none;
}
.hx-download-the-page:before{
content:'';
    position: absolute;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTA4IDUwOCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+IDxjaXJjbGUgc3R5bGU9ImZpbGw6I0ZGRDA1QjsiIGN4PSIyNTQiIGN5PSIyNTQiIHI9IjI1NCIvPiA8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTM3Mi44LDE5NkgzNjhjLTIuNC00MC40LTM1LjYtNzIuNC03Ni40LTcyLjRjLTQsMC04LDAuNC0xMS42LDAuOGMtMTYtMjguNC00Ni00Ny42LTgwLjgtNDcuNiBjLTUxLjIsMC05Mi40LDQxLjYtOTIuNCw5Mi40YzAsMTAuOCwyLDIxLjIsNS4yLDMwLjhjLTI1LjIsMTAtNDIuOCwzNC00Mi44LDYyLjRjMCwzNi40LDI5LjYsNjYuNCw2Ni40LDY2LjRoMjM3LjIgYzM2LjQsMCw2Ni40LTI5LjYsNjYuNC02Ni40QzQzOC44LDIyNS42LDQwOS4yLDE5NiwzNzIuOCwxOTZ6Ii8+IDxwYXRoIHN0eWxlPSJmaWxsOiNGRjcwNTg7IiBkPSJNMzI1LjIsMzYyLjRsLTY2LjQsNjYuNGMtMi44LDIuOC03LjIsMi44LTEwLDBsLTY2LTY2LjRjLTQuNC00LjQtMS4yLTEyLDQuOC0xMmgxNC44IGM0LDAsNy4yLTMuMiw3LjItNy4ydi05NmMwLTQsMy4yLTcuMiw3LjItNy4yaDc0LjhjNCwwLDcuMiwzLjIsNy4yLDcuMnY5NmMwLDQsMy4yLDcuMiw3LjIsNy4yaDE0LjggQzMyNi40LDM1MC40LDMyOS42LDM1OCwzMjUuMiwzNjIuNHoiLz4gPC9zdmc+IA==);
    background-size: cover;
    width: 50px;
    height: 50px;
    margin-left: -50px;
    margin-top: -10px;
    opacity: .35;
    transform: scale(.65);
    transition: all cubic-bezier(0.18, 0.89, 0.32, 1.28) 250ms;
}
.hx-download-the-page:hover {
color:#666;
}
.hx-download-the-page:hover:before {
    opacity:1;
    transform: scale(.7);
}
.hx-download-the-page:active:before {
    opacity:.8;
    transform: scale(.6)  rotateZ(360deg);
}
</style>`);

  const openDown2 = (url, title) => {
    GM_download({
      url,
      name: title,
      headers: {
        Origin: '',
        Referer: '',
      },
      onerror(e) {
        console.log('onerror', e)
      }

    })
  }

  const getLastItem = arr => arr[arr.length - 1]

  const downloadfn = () => {

    document.querySelectorAll('#bookIFlist li').forEach(x => {
      const url = x.querySelector('a').href
      const title = x.querySelector('h2').innerText + '_' + getLastItem(url.split('/'))
      openDown2(url, title)
    })
  }
  const downloadpage = () => {
    if (!JSON.parse(window.localStorage.hxconfirmed || 'false')) {
      if (window.confirm('点击 确认 之后会创建多个下载请求，请将浏览器设置的【每次询问文件保存位置 】关掉')) {
        window.localStorage.hxconfirmed = true
        downloadfn()
      }
    } else {

      downloadfn()
    }




  }


  const downEL = document.createElement('span')
  let length = '统计中…'
  downEL.innerText = '下载本页 ' + length
  setTimeout(_ => {
    downEL.innerText = '下载本页 ' + document.querySelectorAll('#bookIFlist li').length
  }, 1500)
  downEL.className = 'hx-download-the-page'
  downEL.addEventListener('click', downloadpage)
  document.querySelector('.instit h1').parentElement.insertAdjacentElement('beforeend', downEL)
  // Your code here...
})();
