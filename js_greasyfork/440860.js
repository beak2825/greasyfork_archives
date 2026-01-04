// ==UserScript==
// @name         速卖通-弹框样式修改
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  速卖通-弹框样式修改.
// @author       glk
// @match        https://gsp.aliexpress.com/apps/*
// @include      https://gsp.aliexpress.com/apps/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440860/%E9%80%9F%E5%8D%96%E9%80%9A-%E5%BC%B9%E6%A1%86%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/440860/%E9%80%9F%E5%8D%96%E9%80%9A-%E5%BC%B9%E6%A1%86%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const GAOBAI_CONTENT = [
    '别灰心，加油❥(^_-)', 
    '你最棒辣 @——@', 
    '记得按时吃药·臭宝', 
    '回家给你(づ｡◕‿‿◕｡)づ抱抱-',
    '念念不忘~ 必有回响ლ(′◉❥◉｀ლ)',
    '^-^ 记得休息',
    '不准偷懒！'
  ]

  function generateRandomValInGivenNum(lowerInteger, upperInteger) {
    let choices = upperInteger - lowerInteger + 1;
    return Math.floor(Math.random() * choices + lowerInteger)
  }

  function addGaobai() {
    let timer = setInterval(() => {
      let target = document.getElementsByClassName('next-dialog-header')[0]
      if (target) {
        if (!target.children.length) {
          gaobaiEle.innerText = GAOBAI_CONTENT[generateRandomValInGivenNum(0, 4)]
          target.appendChild(gaobaiEle)
        }
      }
    }, 300)
  }
 
  const customStyle = `
    .next-dialog {
      width: 95%!important;
      height: 95%!important;
      max-height: 95%!important;
      top: 2.5%!important;
    }
    .next-dialog-header {
      position: relative!important;
    }
    .next-dialog-header .glk_gaobai {
      position: absolute;
      right: 88px;
      color: #ee3a94;
    }
  `
  let styleEle = document.createElement('style')
  let gaobaiEle = document.createElement('span')
  let dialogHeader = document.getElementsByClassName('next-dialog-header')[0]

  gaobaiEle.className = 'glk_gaobai'
  styleEle.innerHTML = customStyle
  document.getElementsByTagName('head')[0].appendChild(styleEle)
  addGaobai()

})();