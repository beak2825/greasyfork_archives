// ==UserScript==
// @name         淘宝登陆跳转到手机登陆页面
// @version      0.1
// @description  不知道什么原因,QQ浏览器下面,用极速模式时淘宝不能直接登陆,所以有了这个东西
// @author       星雨燃烧
// @namespace    None
// @match        https://login.taobao.com/member/login.jhtml*
// @match        http://login.taobao.com/member/login.jhtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24584/%E6%B7%98%E5%AE%9D%E7%99%BB%E9%99%86%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%89%8B%E6%9C%BA%E7%99%BB%E9%99%86%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/24584/%E6%B7%98%E5%AE%9D%E7%99%BB%E9%99%86%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%89%8B%E6%9C%BA%E7%99%BB%E9%99%86%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    location.href=document.URL.replace("https://login.taobao.com/member/login.jhtml","https://login.m.taobao.com/login.htm");
})();