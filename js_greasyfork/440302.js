// ==UserScript==
// @name         百度文库底部遮罩去除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自用，配合复制文库内容
// @author       You
// @match        https://wenku.baidu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440302/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%BA%95%E9%83%A8%E9%81%AE%E7%BD%A9%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/440302/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E5%BA%95%E9%83%A8%E9%81%AE%E7%BD%A9%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...cover-img-wrap
    var ele = document.getElementsByClassName("try-end-fold-page")[0]
        if (ele != null){
            console.log(ele)
            ele.remove()
        }
    ele = document.getElementsByClassName("cover-img-wrap")[0]
        if (ele != null){
            console.log(ele)
            ele.remove()
        }
})();