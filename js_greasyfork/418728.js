// ==UserScript==
// @name        解除复制限制
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      gavin
// @description 2020/12/17 下午1:29:01
// @downloadURL https://update.greasyfork.org/scripts/418728/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/418728/%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
function traversal(dom){
   var len = dom.length;
   var d = null;
   for(var i=0; i<len; i++){
       d = dom[i];
       //console.log(d);
       element_todo(d);
       //注意children与childNodes区别
       if(d.children){
          traversal(d.children);
       }
   }
   return "done"
}
function element_todo(dom){
    //删除元素的属性，解除复制限制
    dom.removeAttribute("oncopy");
    dom.removeAttribute("oncontextmenu");
    dom.removeAttribute("onkeypress");
    dom.removeAttribute("onkeydown");
    dom.removeAttribute("onkeyup");
}

window.onload = function(){
    document.oncontextmenu=null;
    document.onselectstart=null;
    document.onmousedown=null;
    document.onmouseup=null;
    //遍历元素
    traversal(document.getElementsByTagName("body"));
    console.log("解除复制限制")
}