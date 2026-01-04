// ==UserScript==
// @name         樂天下單
// @description  樂天下單!
// @namespace    https://www.rakuten.com.tw/
// @version      1.0
// @author       lupohan44
// @match        *://www.rakuten.com.tw/shop/*/product/**
// @grant        none
// @require      //code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415645/%E6%A8%82%E5%A4%A9%E4%B8%8B%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/415645/%E6%A8%82%E5%A4%A9%E4%B8%8B%E5%96%AE.meta.js
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
    var refreshDelay = 0;
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
            if(!$('.cart-icon').parent().hasClass('b-disabled')) {
                done = true;
                $('.cart-icon').parent().click();
                if(debug) {
                    console.log("button clicked");
                }
            }
            else {
                refreshDelay++;
                if(refreshDelay>3) {
                    clearInterval(id);
                    location.reload();
                    if(debug) {
                        console.log("reload");
                    }
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
})();