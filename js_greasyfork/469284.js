// ==UserScript==
// @name         长沙理工大学教学平台自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填充学号、密码并登录
// @author       Chao
// @match        http://pt.csust.edu.cn/meol/index.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csust.edu.cn
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469284/%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/469284/%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var loginWrap = document.querySelector('.loginwrap');
    loginWrap.style.display = 'block'
    var userName = document.getElementById('userName')
    userName.setAttribute('value', '学号')
    var passWord = document.getElementById('passWord')
    passWord.setAttribute('value', '密码')
    var form = document.getElementById('login');
    form.submit();
})();
