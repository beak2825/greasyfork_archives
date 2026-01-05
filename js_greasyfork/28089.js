// ==UserScript==
// @name         密码可见
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28089/%E5%AF%86%E7%A0%81%E5%8F%AF%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/28089/%E5%AF%86%E7%A0%81%E5%8F%AF%E8%A7%81.meta.js
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