// ==UserScript==
// @name         知乎简书微博外链不停转
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       a3VjZWNl
// @match        https://link.zhihu.com/?target=*
// @match        https://www.jianshu.com/go-wild?*
// @match        http://t.cn/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/418528/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%E4%B8%8D%E5%81%9C%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/418528/%E7%9F%A5%E4%B9%8E%E7%AE%80%E4%B9%A6%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%E4%B8%8D%E5%81%9C%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let href = window.location.href
    if (href.indexOf('https://link.zhihu.com/?target=') != -1) {
        // close zhihu login page when not logged
        window.onload = () => {
            let btn = document.querySelector('a.button')
            if (btn) btn.click()
            return
        }
    }
    if (href.indexOf('https://www.jianshu.com/go-wild?') != -1) {
        // close zhihu login page when not logged
        window.onload = () => {
            window.location.href = document.querySelector("textarea").value;
        }
    }
    if (href.indexOf('http://t.cn/') != -1) {
        // close zhihu login page when not logged
        window.onload = () => {
            window.location.href = document.querySelector("p.link").innerText;
        }
    }
    //QQ邮箱不进行匹配为了安全
})();