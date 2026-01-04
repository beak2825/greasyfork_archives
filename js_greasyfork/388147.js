// ==UserScript==
// @description 火力全开dy
// @namespace 火力全开
// @name 火力全开
// @version 0.244
// @require https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js
// @require  https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant GM_xmlhttpRequest
// @grant GM.xmlHttpRequest
// @match https://www.douyu.com/*
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @connect open.douyucdn.cn
// @downloadURL https://update.greasyfork.org/scripts/388147/%E7%81%AB%E5%8A%9B%E5%85%A8%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/388147/%E7%81%AB%E5%8A%9B%E5%85%A8%E5%BC%80.meta.js
// ==/UserScript==

(function($){

var interval=setInterval(function(){
 //   var $ic=$('.on-firePower');
    var $ic2=$('span.on-fire');
    if($ic2.length>0){
        var $chart=$('div.ChatSend-button');
        if('发送'==$chart.text()||'开火'==$chart.text()){
            $(".ChatSend textarea").val('666666'+Math.floor(Math.random()*100));
            $chart.hover().click();
        }
    }
},5000);

})(jQuery);