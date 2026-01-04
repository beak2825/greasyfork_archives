// ==UserScript==
// @name         fuck 知乎登录页
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  滚 nm 知乎短信登录, 进知乎登录页面就直接跳转 配合这个脚本更好 https://greasyfork.org/zh-CN/scripts/402655-%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E9%99%86%E5%BC%B9%E7%AA%97-remove-stupid-login-window-on-zhihu-com 
// @author       You
// @match        https://www.zhihu.com/signin?next=%2F
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412506/fuck%20%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/412506/fuck%20%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
   window.location.href="https://www.zhihu.com/search?type=content&q=fuck%E7%9F%A5%E4%B9%8E"
    // Your code here...
})();