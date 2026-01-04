// ==UserScript==
// @name         CSDN免登录复制，屏蔽登录弹窗，自动展开代码
// @version      1.0.1
// @description  CSDN代码块不登录就可以复制
// @author       Charlie
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @namespace https://greasyfork.org/users/1320003
// @downloadURL https://update.greasyfork.org/scripts/498260/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%EF%BC%8C%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/498260/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%EF%BC%8C%E5%B1%8F%E8%94%BD%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // 隐藏登录弹窗
    let loginPopup = document.querySelector('passport-login-container')
    if (loginPopup) {
        loginPopup.style.display = 'none';
    }
    // code可复制
    let codes = document.querySelectorAll('code')
    codes.forEach(c => {
        c.contentEditable = true
    })
    // 自动展开代码
    let setCodeHide = document.querySelectorAll('set-code-hide')
    setCodeHide.forEach(c => {
        console.log(c)
        c.height = 'auto'
    })
    let hidePreCodeBox = document.querySelectorAll('hide-preCode-box')
    hidePreCodeBox.forEach(c => {
        console.log(c)
        c.style.display = 'none';
    })
})();