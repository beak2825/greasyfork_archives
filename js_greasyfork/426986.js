// ==UserScript==
// @name         干掉 Keylol 论坛首页的轮播图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除 Keylol 论坛首页的轮播图
// @author       Neo Wu
// @match        http*://keylol.com/
// @icon         https://www.google.com/s2/favicons?domain=keylol.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426986/%E5%B9%B2%E6%8E%89%20Keylol%20%E8%AE%BA%E5%9D%9B%E9%A6%96%E9%A1%B5%E7%9A%84%E8%BD%AE%E6%92%AD%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/426986/%E5%B9%B2%E6%8E%89%20Keylol%20%E8%AE%BA%E5%9D%9B%E9%A6%96%E9%A1%B5%E7%9A%84%E8%BD%AE%E6%92%AD%E5%9B%BE.meta.js
// ==/UserScript==

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
document.getElementById("frameCX66dD_left").remove();
document.getElementById("frameCX66dD_center").className='column frame';
