// ==UserScript==
// @name         GitHub Stars Astralapp
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  方便展示astralapp的笔记
// @author       You
// @match        https://app.astralapp.com/dashboard
// @grant        none
// @note         增加功能：除锚点以外链接新窗口打开
// @note         增加功能：修复国内访问不了fontawsome的资源问题
// @downloadURL https://update.greasyfork.org/scripts/415473/GitHub%20Stars%20Astralapp.user.js
// @updateURL https://update.greasyfork.org/scripts/415473/GitHub%20Stars%20Astralapp.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const $ = function (query) {
    return document.querySelector(query)
  }
  const $All = function (query) {
    return document.querySelectorAll(query)
  }
  
  const addStyle = function (cssText) {
    const head = $('head')
    const styleTag = document.createElement('style')
    const cssTextNode = document.createTextNode(cssText)
    styleTag.appendChild(cssTextNode)
    head.appendChild(styleTag)
  }
  
  const addScript = function (src) {
    const head = $('head')
    const scriptTag = document.createElement('script')
    scriptTag.src = src
    head.appendChild(scriptTag)
  }
  
  
  const cssText = '.CodeMirror-scroll{\n' +
    '  min-height: 50px!important;\n' +
    '  height: 50px!important;\n' +
    '}\n' +
    '\n' +
    '.star-info .bg-white.pin-b{\n' +
    '  bottom: unset;\n' +
    '}\n' +
    '.CodeMirror-wrap{\n' +
    '  box-shadow: 0 3px #ccc;\n' +
    '}\n' +
    '.repo-readme{\n' +
    '  margin-top: 120px;\n' +
    '}'
  
  const fontAwesome = 'https://cdn.bootcdn.net/ajax/libs/font-awesome/5.15.1/js/all.js'
  addStyle(cssText)
  addScript(fontAwesome)
  
  
  
  let isShow = false
  setTimeout(() => {
    $('.collection-cluster').addEventListener("click", () => {
      setTimeout(() => {
        let links = $All('.repo-readme a:not(.anchor)')
        links.forEach(link=>{
          link.target = '_blank'
        })
      }, 1200)
      if (!isShow) {
        setTimeout(() => {
          $('.tracking-wide').click()
          isShow = true
        }, 500)
      }
      
    })
  }, 1000)
  
  
  // Your code here...
})();
