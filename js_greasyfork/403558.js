// ==UserScript==
// @name         百度首页去除滚动条
// @namespace    Foggy
// @version      0.2
// @author       羊驼的插件
// @match        https://www.baidu.com/
// @match        https://www.baidu.com/?tn=*
// @description  部分插件能够对百度首页优化，但没能找到去除滚动条的，自己试了一下，结果成了
// @downloadURL https://update.greasyfork.org/scripts/403558/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/403558/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==
document.getElementsByTagName('html')[0].style="overflow:hidden";
document.getElementsByTagName('body')[0].style="overflow:hidden";