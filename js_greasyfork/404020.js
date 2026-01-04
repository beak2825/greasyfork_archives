// ==UserScript==
// @name         动漫之家跳转到手机版漫画页面
// @namespace    https://liu233w.com/dmzj-go-mobile
// @version      0.2
// @description  在漫画浏览页面的左下角添加一个按钮，单击之后跳转到手机版的相应页面
// @author       Liu233w
// @match        http://manhua.dmzj.com/*
// @grant        none
// @license      BSD 3-Clause License
// @downloadURL https://update.greasyfork.org/scripts/404020/%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%89%8B%E6%9C%BA%E7%89%88%E6%BC%AB%E7%94%BB%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/404020/%E5%8A%A8%E6%BC%AB%E4%B9%8B%E5%AE%B6%E8%B7%B3%E8%BD%AC%E5%88%B0%E6%89%8B%E6%9C%BA%E7%89%88%E6%BC%AB%E7%94%BB%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('run')

    function gotoMobile() {
        const l = window.location
        window.location = 'https://m.dmzj.com/view' + l.pathname.replace('.shtml', '.html')
    }

    const btn = document.createElement('button')
    btn.innerHTML = '切换到手机版'
    btn.onclick = gotoMobile
    btn.style.position = 'fixed'
    btn.style.bottom = '40px'
    btn.style.left = '40px'
    window.btn = btn

    let oldOnLoad = () => {}
    if (window.onload) {
        oldOnLoad = window.onload
    }
    window.onload = () => {
        console.log('ready')
        document.querySelector('.footer').appendChild(btn)
        oldOnLoad()
    }
})();
