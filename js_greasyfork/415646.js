// ==UserScript==
// @name         樂天購物車繼續結帳
// @description  樂天購物車繼續結帳!
// @namespace    https://www.rakuten.com.tw/
// @version      1.1
// @author       lupohan44
// @match        *://www.rakuten.com.tw/cart/
// @grant        none
// @require      //code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/415646/%E6%A8%82%E5%A4%A9%E8%B3%BC%E7%89%A9%E8%BB%8A%E7%B9%BC%E7%BA%8C%E7%B5%90%E5%B8%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/415646/%E6%A8%82%E5%A4%A9%E8%B3%BC%E7%89%A9%E8%BB%8A%E7%B9%BC%E7%BA%8C%E7%B5%90%E5%B8%B3.meta.js
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
            if($('.qa-cartpage-qtyinput-txtbox') != 1) {
                $('.qa-cartpage-reduceqty-btn').click();
                $('.qa-cartpage-reduceqty-btn').click();
                $('.qa-cartpage-reduceqty-btn').click();
            }
               if(debug){
                console.log("script runing...");
            }
            if(done){
                if(debug){
                    console.log("in case of click fail,try 3 times");
                }
                count++;
            }
            if($('.qa-cart-proceedtocheck-btn') != null) {
                done = true;
                $('.qa-cart-proceedtocheck-btn').click();
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