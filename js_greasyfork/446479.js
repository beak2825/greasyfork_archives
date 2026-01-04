// ==UserScript==
// @name         whsforder2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安逸最后一步预订
// @author       You
// @match        https://www.marriott.com.cn/reservation/reviewDetails.mi*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shangri-la.com
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.0/jquery.cookie.js
// @license MIT
/* globals jQuery, $, waitForKeyElements */

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446479/whsforder2.user.js
// @updateURL https://update.greasyfork.org/scripts/446479/whsforder2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var params = dataLayer ;

    var hotelName = params.prop_name;

    var text = document.getElementsByClassName("js-timer-display-v2 js-res-review-timer t-font-weight-bold t-font-s t-line-height-m t-color-safety-orange t-color-venetian-red")[0].textContent;
  var text2 = document.getElementsByClassName("js-timer-display-v2 js-res-review-timer t-font-weight-bold t-font-s t-line-height-m t-color-safety-orange")[0].textContent;
    if(text.indexOf("预留客房")>-1 ||text2.indexOf("预留客房")>-1){
        sendMsg("预订成功：@@"+hotelName);
    }


      function sendMsg( msg){
      GM_xmlhttpRequest({
            url:'http://139.155.6.142:18888',
            method:"POST",
            data:'dd2='+msg,
           headers: { "Content-Type": "application/x-www-form-urlencoded" },
            onload:function (res){

                console.log(res);
            }
			});
    }


})();