// ==UserScript==
// @name         设置网站是否记住滚动位置
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  用户可设置当前网页是否需要在普通刷新后记住之前的滚动位置
// @author       glk
// @include      https://*/*
// @icon         https://www.google.com/s2/favicons?domain=codepen.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446399/%E8%AE%BE%E7%BD%AE%E7%BD%91%E7%AB%99%E6%98%AF%E5%90%A6%E8%AE%B0%E4%BD%8F%E6%BB%9A%E5%8A%A8%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/446399/%E8%AE%BE%E7%BD%AE%E7%BD%91%E7%AB%99%E6%98%AF%E5%90%A6%E8%AE%B0%E4%BD%8F%E6%BB%9A%E5%8A%A8%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const SRCtrlText_True = '记住滚动位置'
  const SRCtrlText_False = '忘记滚动位置'

  const STYLE = `
    #ScrollRestoration {
     position: fixed;
     top: 50%;
     left: 5px;
     font-size: 12px;
     border-radius: 8px;
     padding: 8px;
     box-shadow: 0 0 3px #ccc;
     width: 25px;
     color: #333;
     background: #fff;
     z-index: 999;
     cursor: pointer;
     box-sizing: border-box;
    }
  `

  window.addStyle = (styStr = "") => {
    let _style = document.createElement('style')
    _style.innerHTML = styStr
    document.getElementsByTagName('head')[0].appendChild(_style)
  }

  function setSRCtrlText () {
    if(window.history.scrollRestoration === 'manual') {
      window.SRCtrl.innerText = SRCtrlText_True
    } else {
      window.SRCtrl.innerText = SRCtrlText_False
    }
  }

  window.bindEvent = (arr) => {
    const scrollRestoration = document.getElementById('ScrollRestoration')
    scrollRestoration.addEventListener('click', () => {
      if (window.history.scrollRestoration) {
        window.history.scrollRestoration === 'manual' ? window.history.scrollRestoration = 'auto' : window.history.scrollRestoration = 'manual'
        setSRCtrlText()
      }
    })
  }

  window.createDom = () => {
    window.SRCtrl = document.createElement('div')
    setSRCtrlText()
    window.SRCtrl.id = 'ScrollRestoration'
    document.body.append(window.SRCtrl)
  }

  window.addEventListener("load", function () {
    window.addStyle(STYLE)
    window.createDom()
    window.bindEvent(window.audioArr)
  })

})();