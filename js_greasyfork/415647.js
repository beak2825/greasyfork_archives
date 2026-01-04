// ==UserScript==
// @name         樂天配送繼續付款
// @description  樂天配送繼續付款!
// @namespace    https://www.rakuten.com.tw/
// @version      1.1
// @author       lupohan44
// @match        *://www.rakuten.com.tw/buy/shipping?l-id=tw_checksignin_member
// @grant        none
// @require      //code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415647/%E6%A8%82%E5%A4%A9%E9%85%8D%E9%80%81%E7%B9%BC%E7%BA%8C%E4%BB%98%E6%AC%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/415647/%E6%A8%82%E5%A4%A9%E9%85%8D%E9%80%81%E7%B9%BC%E7%BA%8C%E4%BB%98%E6%AC%BE.meta.js
// ==/UserScript==

'use strict';
(function() {
    'use strict';
    var debug = true;
    var done = false;
    var stop = (localStorage.getItem('stop') == null? false: localStorage.getItem('stop'));
    var count = 0;
    var delay = 100;
    var retry = 1;
    if(!stop) {
        var id = setInterval(function(){
            if(debug){
                console.log("script runing...");
            }
            if(done){
                if(debug){
                    console.log("in case of click fail,try 3 times");
                }
                count++;
            }
            if($('.lt-continue-payment') != null) {
                done = true;
                $('.lt-continue-payment').click();
                if(debug) {
                    console.log("button clicked");
                }
            }
            if(done&&count>=retry){
                if(debug){
                    console.log("done");
                }
                clearInterval(id);
            }
        },delay);
    }
})