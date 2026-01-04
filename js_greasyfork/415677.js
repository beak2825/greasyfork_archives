// ==UserScript==
// @name         sogou公众号搜索结果导出图片
// @namespace    https://greasyfork.org/zh-CN/users/443879-fanzhixin
// @version      0.1
// @description  将sogou公众号搜索结果导出成图片
// @author       Bill Fan 范志鑫
// @match        https://weixin.sogou.com/weixin*
// @include     https://weixin.sogou.com/weixin*
// @run-at document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/415677/sogou%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%AF%BC%E5%87%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/415677/sogou%E5%85%AC%E4%BC%97%E5%8F%B7%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%AF%BC%E5%87%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {

    // Your code here...


//var inputdata= window.prompt("保存地址：");
 //window.alert(inputdata);
 var hd=document.getElementsByTagName("h3");
 
 for(i=0;i<hd.length;i++)
 {

 //window.alert(hd[i].innerText);
 var al=hd[i].getElementsByTagName("a");
 var link=al[0].href;
 savetoimg(link);
 }

function savetoimg(link){
window.open(link);
//ndoc.print();
return;
}

})();