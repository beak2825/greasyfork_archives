// ==UserScript==
// @name         打开所有标签
// @namespace    http://tampermonkey.net/
// @version      0.65
// @description  用于批量打开纠纷和取消页面
// @author       李远
// @match        https://trade.aliexpress.com/issue/issueList.htm
// @match     https://gsp.aliexpress.com/apps/order/index*
//@require https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/404310/%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/404310/%E6%89%93%E5%BC%80%E6%89%80%E6%9C%89%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    
    // Your code here...
    GM_registerMenuCommand("批量打开",nativeOpen);
 
})();




unsafeWindow.myOpen=function(){

    var a=$(".dispute-status-cell a,.viewDetails .dada-cell-wrap a");
    open(a,0);
}
function open (Ele,n){
    if(n>Ele.length){
        return
    }else{
    Ele[n].click();
      setTimeout(open,200,Ele,n+1);
    }


}

function nativeOpen(){

myOpen();
}