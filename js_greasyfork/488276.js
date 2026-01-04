// ==UserScript==
// @name         云展网净化器
// @namespace    https://penicillin.github.io/
// @version      2024-02-26
// @description  去除干扰元素
// @author       Penicillinm
// @match        https://paper.ceamg.cn/books/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488276/%E4%BA%91%E5%B1%95%E7%BD%91%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/488276/%E4%BA%91%E5%B1%95%E7%BD%91%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    var myStyle = document.createElement('style') //创建div标签
    myStyle.innerHTML="._powerlimit_dialog{display:none;}"
    document.head.appendChild(myStyle)
})();