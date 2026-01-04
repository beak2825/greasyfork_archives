// ==UserScript==
// @name         阮一锋科技爱好者周刊公众号引用链接优化
// @namespace    https://greasyfork.org
// @version      1.0
// @description  将链接地址直接关联到引用的小数字标签上，点击数字即可跳转引用链接
// @author       kongwe
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530411/%E9%98%AE%E4%B8%80%E9%94%8B%E7%A7%91%E6%8A%80%E7%88%B1%E5%A5%BD%E8%80%85%E5%91%A8%E5%88%8A%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BC%95%E7%94%A8%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530411/%E9%98%AE%E4%B8%80%E9%94%8B%E7%A7%91%E6%8A%80%E7%88%B1%E5%A5%BD%E8%80%85%E5%91%A8%E5%88%8A%E5%85%AC%E4%BC%97%E5%8F%B7%E5%BC%95%E7%94%A8%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let author = document.querySelector("meta[name='author']")
    if(author.getAttribute("content") == '阮一峰'){
        let refs = document.querySelectorAll("span>sup")
        let links = document.querySelectorAll("i>span")
        for(let i=0;i<refs.length;i++){
            let a = document.createElement("a")
            a.innerText = refs[i].innerText
            a.setAttribute("href", links[i].innerText)
            refs[i].innerText = ''
            refs[i].appendChild(a)
        }
    }
    // Your code here...
})();