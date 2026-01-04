// ==UserScript==
// @name         TBMarsi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  taobao Shopping Cart Assistant.
// @author       March
// @match        https://cart.taobao.com/*
// @match        https://buy.tmall.com/order/confirm_order.htm*
// @icon         https://www.taobao.com/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440886/TBMarsi.user.js
// @updateURL https://update.greasyfork.org/scripts/440886/TBMarsi.meta.js
// ==/UserScript==

(function() {
    var domain = window.location.host;
    switch(domain){
        case "cart.taobao.com":
            setTimeout(function(){
                var allSelect=document.querySelector('#J_SelectAll1');
                setTimeout(function(){allSelect.click()},100);
                var isClicked=false;
                window.setInterval(function(){
                    if(isClicked==true)return;
                    var refreshHours = new Date().getHours();
                    var refreshMin = new Date().getMinutes();
                    var refreshSec = new Date().getSeconds();
                    if(refreshHours=='14' && refreshMin=='0' && refreshSec=='1'){
                        var jGo=document.querySelector('#J_Go');
                        jGo.click();
                        isClicked=true;
                    }
                }, 100);
            }, 3000);
            break;
        case "buy.tmall.com":
            var clicked=false;
            setInterval(function(){
                if(clicked==true)return;
                var submit=document.querySelector('.go-btn');
                if(submit!=null){
                    submit.click();
                    clicked=true;
                }
            },100);
            break;
    }

})();