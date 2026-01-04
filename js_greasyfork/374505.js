// ==UserScript==
// @name         去掉登陆百度后默认搜索结果在新窗口打开
// @namespace    undefined
// @version      0.1.1
// @description  登陆百度后，百度首页点击百度一下默认会打开一个新窗口，太恶心了
// @author       x2009again
// @match        *://www.baidu.com/*
// @grant        none
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/374505/%E5%8E%BB%E6%8E%89%E7%99%BB%E9%99%86%E7%99%BE%E5%BA%A6%E5%90%8E%E9%BB%98%E8%AE%A4%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%9C%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/374505/%E5%8E%BB%E6%8E%89%E7%99%BB%E9%99%86%E7%99%BE%E5%BA%A6%E5%90%8E%E9%BB%98%E8%AE%A4%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%9C%A8%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
document.getElementById('form').setAttribute("target","_self");