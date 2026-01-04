// ==UserScript==
// @name         ethan小黃
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ethan小黃 functions
// @author       You
// @match        https://seller.shopee.tw/*
// @match        https://seller.shopee.tw*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopee.tw
// @grant        GM_setClipboard
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/529777/ethan%E5%B0%8F%E9%BB%83.user.js
// @updateURL https://update.greasyfork.org/scripts/529777/ethan%E5%B0%8F%E9%BB%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        var tokenObject = JSON.parse(localStorage.getItem("mini-session"));
        var user = tokenObject.user;
        var shopId = user.shop_id;
        
        var button = $('.content-box').children().last();
        button.after(`
<div data-v-54de29dd="" class="breadcrumb shopee-breadcrumb shopee-breadcrumb--light">
  <div data-v-54de29dd="" class="breadcrumb-item shopee-breadcrumb-item">
    <div class="shopee-breadcrumb-item__inner">
      <a data-v-54de29dd="" class="router-link-active breadcrumb-name"></a>
    </div>
    <div class="shopee-breadcrumb-item__separator">
      <i class="shopee-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M9.18933983,8 L5.21966991,11.9696699 C4.9267767,12.2625631 4.9267767,12.7374369 5.21966991,13.0303301 C5.51256313,13.3232233 5.98743687,13.3232233 6.28033009,13.0303301 L10.7803301,8.53033009 C11.0732233,8.23743687 11.0732233,7.76256313 10.7803301,7.46966991 L6.28033009,2.96966991 C5.98743687,2.6767767 5.51256313,2.6767767 5.21966991,2.96966991 C4.9267767,3.26256313 4.9267767,3.73743687 5.21966991,4.03033009 L9.18933983,8 Z"></path>
        </svg>
      </i>
    </div>
  </div>  <div data-v-54de29dd="" class="breadcrumb-item shopee-breadcrumb-item">
    <div class="shopee-breadcrumb-item__inner">
      <a data-v-54de29dd="" id="checkDiscount" class="router-link-active breadcrumb-name"> 小黃牌檢查 </a>
    </div>
    <div class="shopee-breadcrumb-item__separator">
      <i class="shopee-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M9.18933983,8 L5.21966991,11.9696699 C4.9267767,12.2625631 4.9267767,12.7374369 5.21966991,13.0303301 C5.51256313,13.3232233 5.98743687,13.3232233 6.28033009,13.0303301 L10.7803301,8.53033009 C11.0732233,8.23743687 11.0732233,7.76256313 10.7803301,7.46966991 L6.28033009,2.96966991 C5.98743687,2.6767767 5.51256313,2.6767767 5.21966991,2.96966991 C4.9267767,3.26256313 4.9267767,3.73743687 5.21966991,4.03033009 L9.18933983,8 Z"></path>
        </svg>
      </i>
    </div>
  </div>
</div>    `);

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i <ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

    },10700);

    // Your code here...
})();