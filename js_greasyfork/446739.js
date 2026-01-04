// ==UserScript==
// @name         字魂字体下载
// @namespace    http://tampermonkey.net/
// @version      0.0.3

// @description  可免登录下载字魂中多种格式字体
// @author       glk
// @include      https://izihun.com/*/*
// @icon         https://izihun.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446739/%E5%AD%97%E9%AD%82%E5%AD%97%E4%BD%93%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/446739/%E5%AD%97%E9%AD%82%E5%AD%97%E4%BD%93%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';
    
  const STYLE = `

    *{
      box-sizing: border-box;
    }

    .list-con {
      position: relative;
    }
  
    .list-con .glk_custom_down {
      position: absolute;
      right: 40px;
      bottom: 10px;
      padding: 5px 10px;
      border-radius: 3px;
      width: 100px;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      color: #fff;
      cursor: pointer;
      background: linear-gradient(90deg,#1fb29c 0,#81d6a5 100%);
      z-index: 999;
      user-select: none;
    }

    .glk_custom_down ul {
      position: absolute;
      width: 100%;
      left: 0;
      top: 100%;
      display: none;
      list-style: none;
      margin: 0;
      padding: 5px 0;
      box-shadow: 0 0 2px #EDEDEB;
      background: #fff;
      color: #a19393;
    }

    .glk_custom_down:hover ul{
      display: block;
    }

    .glk_custom_down ul li {
      padding: 5px 10px;
      cursor: pointer;
      font-weight: bold;
    }

    .glk_custom_down ul li:hover {
      color: #fff;
      background: #86b5b2;
    }
  `

  window.addStyle = (styStr = "") => {
    let _style = document.createElement('style')
    _style.innerHTML = styStr
    document.getElementsByTagName('head')[0].appendChild(_style)
  }

  window.downloadFile = (src = "", fileName) => {
    let link = document.createElement('a');
    link.style.display = 'none'
    link.href = src
    fileName && link.setAttribute("download", fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link);
  }

  // 根目录
  const baseUrl = 'https://ttf.izihun.com/font/build'
  
  // 返回最近的一个Link标签
  window.getLinkPreEle = (ele) => {
    let pre = ele.previousElementSibling
    while(pre && pre.tagName !== 'LINK') {
      pre = pre.previousElementSibling
    }
    return pre
  }

  window.addEventListener("load", function () {
    // 添加自定义样式
    addStyle(STYLE)

    // 添加下载按钮
    Array.from( document.getElementsByClassName('list-con')).forEach((i, idx) => {
      const prevChild = getLinkPreEle(i)
      const fontFileSuper = prevChild.href.replace(baseUrl, '').split('/')
      const fontWords = i.querySelector('.works-href .font-words')
      const conTopR = i.querySelector('.con-top .con-top-r')
      const fontName = i.querySelector('.con-top .font-class').textContent
      const fontFamily = getComputedStyle(fontWords).fontFamily
      const spliFontFa = fontFamily.split('-')
      const customDownload = document.createElement('div')
      customDownload.innerHTML = `
        <span>下载</span>
        <ul>
          <li>.ttf</li>
          <li>.eot</li>
          <li>.woff</li>
        </ul>
      `
      customDownload.className = 'glk_custom_down'
      customDownload.onclick = (e) => {
        console.log('e', e, e.target)
        const target = e.target
        if (target.tagName === 'LI') {
          const fontFileType = target.textContent
          const fontFileSrc = `${baseUrl}/${spliFontFa[1]}/${fontFileSuper[2]}/${spliFontFa[2]}${fontFileType}`
          downloadFile(fontFileSrc, `${fontName}${fontFileType}`)
        }
      }
      i.appendChild(customDownload)
    })

  })

})();