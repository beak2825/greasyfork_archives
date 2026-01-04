// ==UserScript==
// @name         微软文档始终显示语言切换按钮
// @namespace    https://github.com/staoran/Userscript
// @version      0.2
// @description  显示在英语页被隐藏的语言切换按钮
// @author       Tao<staoran@gmail.com>
// @license          MIT
// @supportURL       https://github.com/staoran/Userscript/issues
// @match               http*://msdn.microsoft.com/en-us/*
// @match               http*://msdn.microsoft.com/zh-cn/*
// @match               http*://docs.microsoft.com/en-us/*
// @match               http*://docs.microsoft.com/zh-cn/*
// @match               http*://learn.microsoft.com/en-us/*
// @match               http*://learn.microsoft.com/zh-cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450056/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E5%A7%8B%E7%BB%88%E6%98%BE%E7%A4%BA%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/450056/%E5%BE%AE%E8%BD%AF%E6%96%87%E6%A1%A3%E5%A7%8B%E7%BB%88%E6%98%BE%E7%A4%BA%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

var lang = document.getElementById('lang-link-tablet')
if (lang.hidden && document.URL.search(/\/zh-cn\//) == -1) {
    lang.hidden = false
    lang.title = '使用中文阅读'
    lang.href = location.href.replace(/\/en-us\//, '\/zh-cn\/')
}
