// ==UserScript==
// @name         中国高清网辅助工具
// @namespace
// @include      *://gaoqing.la/*.html
// @version      0.0.3
// @description  中国高清网辅助工具:豆瓣/IMDb链接
// @author       ymzhao
// @namespace 
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476982/%E4%B8%AD%E5%9B%BD%E9%AB%98%E6%B8%85%E7%BD%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/476982/%E4%B8%AD%E5%9B%BD%E9%AB%98%E6%B8%85%E7%BD%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
;(function() {
	'use strict'
 
    window.onload = function() {
        const urlRegex = /https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?/i;
        Array.from(document.querySelectorAll('#post_content>p:nth-child(2)>span')).forEach(node => {
            if(urlRegex.test(node.innerText)) {
                const m = node.innerText.match(urlRegex)
                if(m) {
                    node.innerHTML = node.innerText.replace(urlRegex, `<a href="${m[0]}" target="_blank">${m[0]}</a>`)
                }
            }
        })
    }
})();