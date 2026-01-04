// ==UserScript==
// @name         whsforder
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安逸自动点击1
// @author       You
// @match        https://www.marriott.com.cn/reservation/rateListMenu.mi*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shangri-la.com
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.0/jquery.cookie.js
/* globals jQuery, $, waitForKeyElements */
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446478/whsforder.user.js
// @updateURL https://update.greasyfork.org/scripts/446478/whsforder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

      var productNames ='香港海洋公园万豪酒店 香港万怡酒店 香港沙田万怡酒店 香港 W 酒店 香港东涌福朋喜来登酒店';
    var params = dataLayer ;

    var hotelName = params.prop_name;
    if("香港东涌福朋喜来登酒店"==hotelName){
        var price = document.getElementsByClassName("t-font-xl l-display-inline-block l-margin-none t-font-weight-bold")[0].textContent;
        if(price && price.trim()==99,999){


            setTimeout (function(){

                location.reload();
            },1000*3);

           
        }
    }

    if(productNames.indexOf(hotelName)==-1){
        return;
    }

    var dayLen = params.res_stay_length;

    var list = document.getElementsByClassName("not-cancellable l-row rph-row widget-container t-border-bottom t-border-color-standard-110 l-padding-top l-padding-bottom l-pos-relative l-width-max l-rate-inner-container l-clear-both ")

    for (let i = 0; i < list.length; i++) {

        var obj = $(list[i]);
        var price = obj.attr("data-totalpricebeforetax");
        price = price.replace(",","");
        if(price>3000){
            continue;
        }
        var as = obj.find("a");
        for(let j =0;j<as.length;j++){

            if(as[j].text='选择'){
                location.href= $(as[j]).attr("href")
            }
        }
    }



})();