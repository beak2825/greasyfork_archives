// ==UserScript==
// @name         展开全文 免登录
// @namespace    aaa
// @version      0.91
// @description  免登录展开CSDN全文
// @author       aaa
// @match        *://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375212/%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%20%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/375212/%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%20%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.host == "blog.csdn.net") {
        var readMore = document.getElementById("btn-readmore");
        if (readMore !== null){
            readMore.click();
        }

      //  setTimeout(needLogin,1000000); 
       
    }
})();

function needLogin (){
     var tipBox = document.getElementsByClassName("tip-box").innerHTML = '';
}
