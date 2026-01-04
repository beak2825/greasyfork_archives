// ==UserScript==
// @name         淘宝删除地址
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  deletetaobaoaddress
// @author       You
// @match        https://member1.taobao.com/member/fresh/deliver_address.htm*
// @require      https://cdn.staticfile.org/jquery/3.7.0/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/466550/%E6%B7%98%E5%AE%9D%E5%88%A0%E9%99%A4%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/466550/%E6%B7%98%E5%AE%9D%E5%88%A0%E9%99%A4%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    window.onload=function(){
        console.log('我执行了')
        let eleBody = document.querySelector('.next-table-body');
        var remove;
        if(eleBody){
            console.log('开始删除')
            remove = setInterval(function(){
                delAddress();
            },2000)
        }else{
            clearInterval(remove)
        }
        function delAddress(){
            let ele = eleBody.children[0]
            ele.querySelector('.t-delete').click();
            let buttonTrue = document.querySelector('div[role="dialog"] .next-btn-helper');
            if(buttonTrue){
                buttonTrue.click();
            }
        }
    }
 
 
 
 
})();