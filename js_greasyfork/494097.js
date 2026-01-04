// ==UserScript==
// @name         AutoPriceIncreaser
// @namespace    https://zelenka.guru/m1ch4elx/
// @version      1.0
// @license      With Love
// @description  for @moritz
// @author       @M1ch4elx
// @match        https://lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lzt.market
// @downloadURL https://update.greasyfork.org/scripts/494097/AutoPriceIncreaser.user.js
// @updateURL https://update.greasyfork.org/scripts/494097/AutoPriceIncreaser.meta.js
// ==/UserScript==

!function(){
   let request_url;
   var origOpen = XMLHttpRequest.prototype.open;

  XMLHttpRequest.prototype._original_send = XMLHttpRequest.prototype.send;

   let interceptor_open = function(method, url) {
       if (url.includes('edit-simple')) {
         request_url = url;
         XMLHttpRequest.prototype.send = interceptor_send;
       }
       origOpen.apply(this, arguments);
   }

  let interceptor_send = function(data){
      let new_args = data;
      let that = this;
      let counter = 0;
      const params = new URLSearchParams(`?${new_args}`);
      let current_price = parseInt(params.get('value'));
      let new_price = (current_price + current_price * 0.15);
      params.set('value', new_price);
      this._original_send(params.toString());
    };
XMLHttpRequest.prototype.open = interceptor_open;
}();
