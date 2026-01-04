// ==UserScript==
// @name         Apifox接口文档分享设置密码框为password
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Apifox接口文档分享别人进入为text输入框，不能让浏览器记住，使用该插件能让让浏览器自动记住，下次不必去翻找密码
// @author       XianwenYu
// @match        https://apifox.com/apidoc/auth-shared*
// @icon         https://apifox.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479017/Apifox%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E5%88%86%E4%BA%AB%E8%AE%BE%E7%BD%AE%E5%AF%86%E7%A0%81%E6%A1%86%E4%B8%BApassword.user.js
// @updateURL https://update.greasyfork.org/scripts/479017/Apifox%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3%E5%88%86%E4%BA%AB%E8%AE%BE%E7%BD%AE%E5%AF%86%E7%A0%81%E6%A1%86%E4%B8%BApassword.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){
        document.querySelector('#password').setAttribute('type','password')
        console.log('😄');
    },1000)
})();