// ==UserScript==
// @name         removeMiFont
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  修正小米社区在WIN10上字体撕裂问题
// @author       毛毛(来自非正常锤友研究中心QQ群155959969)
// @match        https://*.xiaomi.cn/*
// @icon         https://www.xiaomi.cn/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/438595/removeMiFont.user.js
// @updateURL https://update.greasyfork.org/scripts/438595/removeMiFont.meta.js
// ==/UserScript==
(function () {
  'use strict'

  !((newStyle) => {
    let styleElement = document.querySelector('#styles_js')
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.type = 'text/css'
      styleElement.id = 'styles_js'
      document.getElementsByTagName('head')[0].appendChild(styleElement)
    }
    styleElement.appendChild(document.createTextNode(newStyle))
  })('html , html * {font-family:"微软雅黑,Tahoma,sans-serif"!important;}')

})();