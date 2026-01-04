// ==UserScript==
// @name         师德教育自动学习
// @namespace   http://i.yanxiu.com/
// @version      0.1
// @description  师德教育自动学习,自动翻页
// @author       haoshenqi
// @match        http://i.yanxiu.com/uft/train/zjfzxx/course/detail.vm*
// @icon         http://www.yanxiu.com/favicon.ico
// @grant        none
// @connect haoshenqitop.163.com
// @downloadURL https://update.greasyfork.org/scripts/429016/%E5%B8%88%E5%BE%B7%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/429016/%E5%B8%88%E5%BE%B7%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //引入jquery
    var jq = document.createElement('script');
    jq.src = "https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
    function wating(){
        var next = $("#daimiao")
        var xia = $("#xia")
        var text = next.text().trim()
        if(text=="下一页（1s）"){
            //触发翻页
            xia.click();
        }
        //等待16秒 循环翻页
        setTimeout(wating,16000);
    }
    wating();
})();