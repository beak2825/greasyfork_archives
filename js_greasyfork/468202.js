// ==UserScript==
// @name         豆瓣网页扩展
// @namespace    http://douban.tampermonkey.net/
// @version      0.2
// @description  PC网页上可以直接查看用户广播内容的详情，浏览“转发”、“点赞”内容
// @author       You
// @match        *://*.douban.com/*
// @icon         https://img1.doubanio.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468202/%E8%B1%86%E7%93%A3%E7%BD%91%E9%A1%B5%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/468202/%E8%B1%86%E7%93%A3%E7%BD%91%E9%A1%B5%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.getElementById('comments') != null){
        return
    }

    [...document.querySelectorAll('.status-item')].forEach(item => {
        let details = document.createElement("a")
        details.href = 'https://www.douban.com/people/153283651/status/' + item.getAttribute('data-sid')
        details.appendChild(document.createTextNode("\u00A0\u00A0//查看详情"))
        details.setAttribute ("target", "_blank")
        details.className = "btn btn-action-reply new-reply"

        item.querySelector('.actions').appendChild(details)
    })

})();