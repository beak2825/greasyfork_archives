// ==UserScript==
// @name         CSDN免登录复制
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  CSDN复制代码是不是需要登录？不想登录又想拷贝代码作测试怎么办？也许你可以试试这个脚本
// @author       Gueson
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448095/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/448095/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var removeLoginList = document.getElementsByTagName('code')
    var list = Array.from(removeLoginList)
    list.forEach(function(ele) {
      ele.setAttribute('contenteditable', true)
    })
})();