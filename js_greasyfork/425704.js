// ==UserScript==
// @name         直接显示半次元（bcy.net）原图
// @namespace    https://www.dongmanxingkong.com/
// @version      2.2
// @description  直接显示半次元（bcy.net）原图，而非缩略图
// @author       那天的流星
// @match        https://bcy.net/*/detail/*
// @grant        unsafeWindow
// @run-at		 document-end
// @downloadURL https://update.greasyfork.org/scripts/425704/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%8D%8A%E6%AC%A1%E5%85%83%EF%BC%88bcynet%EF%BC%89%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/425704/%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA%E5%8D%8A%E6%AC%A1%E5%85%83%EF%BC%88bcynet%EF%BC%89%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

/*
 *@作者：那天的流星
 *@博客：https://www.dongmanxingkong.com/
 *@转载重用请保留此信息
 *@QQ群：953147872
 */

document.body.innerHTML = document.body.innerHTML.replace(/tplv-banciyuan-w650.image/g, 'noop.jpg');