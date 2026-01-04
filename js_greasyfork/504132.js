// ==UserScript==
// @name         TextbookPlus
// @namespace    https://basic.smartedu.cn
// @version      1.0.0
// @description  国家中小学智慧教育平台教材浏览辅助插件
// @author       lzsr
// @match        https://basic.smartedu.cn/pdfjs/2.13/web/viewer.html?*
// @icon         https://basic.smartedu.cn/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.19.2
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504132/TextbookPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/504132/TextbookPlus.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var con = confirm(`请使用者使用该脚本前确认以下注意事项：
1.使用者通过该脚本（包括但不限于直接使用、复制、修改等方式）获取的内容（如教材图片等）仅供个人研究学习所用，
  不得未经教材作者及其他著作权人许可商用，否则由此产生的法律后果由使用者本人承担；
2.该脚本不定期更新，使用者可通过Greasy Fork网站对该脚本提出建议；
如已阅读并确认以上内容，请点击确定以使用该脚本
    `);
  if(!con) {
    return
  }
  const GUI = lil.GUI
  const gui = new GUI()
  const HEAD = document.head
  const BODY = document.body
  var x
  var style = document.createElement('style')
  style.type = 'text/css'
  style.id = '__web-inspector-hide-shortcut-style__'
  var cssContent = document.createTextNode(`.__web-inspector-hide-shortcut__, .__web-inspector-hide-shortcut__ *, .__web-inspector-hidebefore-shortcut__::before, .__web-inspector-hideafter-shortcut__::after {
	visibility: hidden !important;
}`);
  style.appendChild(cssContent)
  HEAD.appendChild(style);
  var textChange = {
    '自动刷新': true,
    '文本状态': '显示',
    '刷新文本状态': () => {
      switch (textChange['文本状态']) {
        case '显示':
          x = document.getElementsByClassName("textLayer __web-inspector-hide-shortcut__");
          if(x.length) {
            for(const y of x) {
              console.log('已显示' + y.parentNode.ariaLabel + '文本')
              y.classList.remove('__web-inspector-hide-shortcut__')
            }
          }
          break
        case '隐藏':
          x = document.getElementsByClassName("textLayer");
          if(x.length) {
            for(const y of x) {
              if(!(y.classList.contains("__web-inspector-hide-shortcut__"))) {
                console.log('已隐藏' + y.parentNode.ariaLabel + '文本')

              }
              y.classList.add('__web-inspector-hide-shortcut__')
            }
          }
          break
        case '删除':
          x = document.getElementsByClassName("textLayer");
          if(x.length) {
            for(const y of x) {
              console.log('已删除' + y.parentNode.ariaLabel + '文本')
              y.remove()
            }
          }
      }
    }
  }


  gui.add(textChange, '自动刷新')
    .onChange(() => {
      if(textChange['自动刷新']) {
        BODY.addEventListener("wheel", textChange['刷新文本状态']);
        console.log('已启用自动刷新')
      } else {
        BODY.removeEventListener("wheel", textChange['刷新文本状态']);
        console.log('已禁用自动刷新')
      }


    })
  gui.add(textChange, '文本状态', ['显示', '隐藏', '删除'])
    .onChange(() => {
      console.log(textChange['文本状态'])
    })
  gui.add(textChange, '刷新文本状态')
    .onChange(() => {
      console.log('已刷新')
    })
  BODY.addEventListener("wheel", textChange['刷新文本状态']);
  console.log('已启用自动刷新')
})();