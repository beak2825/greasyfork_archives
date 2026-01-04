// ==UserScript==
// @name        微信读书、得到电子书字体样式美化
// @namespace    https://github.com/nanvon
// @description 阅读网页端微信读书、得到电子书的字体更加好看^_^ 可自行替换为其他字体
// @author       nanvon
// @version     0.2
// @match        *://dedao.cn/*
// @match        *://*.dedao.cn/*
// @match        *://weread.qq.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445892/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E3%80%81%E5%BE%97%E5%88%B0%E7%94%B5%E5%AD%90%E4%B9%A6%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/445892/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E3%80%81%E5%BE%97%E5%88%B0%E7%94%B5%E5%AD%90%E4%B9%A6%E5%AD%97%E4%BD%93%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

var css = document.createElement('style');
var text = document.createTextNode('{text-decoration:none!important;}*:not(i):not([class*="hermit"]):not([class*="btn"]):not([class*="button"]):not([class*="ico"]):not(i){font-family: "Fira Code","方正聚珍新仿简体","LXGW ZhenKai" !important; }');
css.appendChild(text);
document.getElementsByTagName('head') [0].appendChild(css);
