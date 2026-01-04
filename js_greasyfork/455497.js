// ==UserScript==
// @name         职教云复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击题目自动将题目复制到剪贴板
// @author       You
// @match        *://zjy2.icve.com.cn/*
// @license      ccccq
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icve.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455497/%E8%81%8C%E6%95%99%E4%BA%91%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/455497/%E8%81%8C%E6%95%99%E4%BA%91%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    var a = document.querySelectorAll(".ErichText");
    for(var i = 0;i < a.length;i++){
        a[i].onclick = function(e){
            copyHandle(this.innerText);
        }
    }
    function copyHandle(content){
        let copy = (e)=>{
            e.preventDefault()
            e.clipboardData.setData('text/plain',content)
            document.removeEventListener('copy',copy)
        }
        document.addEventListener('copy',copy)
        document.execCommand("Copy");
    }
})();