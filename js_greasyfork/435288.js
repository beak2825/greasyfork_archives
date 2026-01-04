// ==UserScript==
// @name        自动编写助手
// @namespace   BingTrans
// @description 自动改写文字语法和格式
// @include     https://greasyfork.org/zh-CN/scripts?set=525682
 
// @version    2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/435288/%E8%87%AA%E5%8A%A8%E7%BC%96%E5%86%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/435288/%E8%87%AA%E5%8A%A8%E7%BC%96%E5%86%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var tt = setInterval(function(){
    if(document.querySelector(".destinationText") != null){
        clearInterval(tt);
        document.querySelector(".destinationText table td[value='zh-CHS']").click();
    }
}, 500);


