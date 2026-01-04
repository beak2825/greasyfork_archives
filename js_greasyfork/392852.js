// ==UserScript==
// @name         显示密码框内容
// @namespace https://greasyfork.org/users/91873
// @version      1.0.0.3
// @description  鼠标划过密码框时显示密码框内容
// @author       wujixian
// @include      http*://*
// @exclude      *baidu.com*
// @exclude      *google.com*
// @exclude      *sanguosha.com*
// @grant        none
// @run-at		 document-end
// @downloadURL https://update.greasyfork.org/scripts/392852/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E6%A1%86%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/392852/%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81%E6%A1%86%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

window.onload=function(){
    var list=document.querySelectorAll("input[type=password]");
    for(var i=0;i<list.length;i++){
        (function(i){
            list[i].onmouseover=function(){
                list[i].setAttribute("type","text");
            };
            list[i].onmouseout=function(){
                list[i].setAttribute("type","password");
            };
        })(i);
    }
};