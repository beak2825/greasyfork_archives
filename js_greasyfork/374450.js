// ==UserScript==
// @name         tNumy move ad
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://t*y.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374450/tNumy%20move%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/374450/tNumy%20move%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var script = document.createElement('script');
    script.innerHTML = "function readS(){console.info('yes readS')}";
    document.getElementsByTagName('head')[0].appendChild(script);

    var all_ad_img = document.querySelectorAll('[data-link]');
    all_ad_img.forEach(function(item, index) {
        if(index+3 < all_ad_img.length) {
            var nextEle = item.nextElementSibling;
            if(nextEle) {
                nextEle.remove();
            }
            item.remove();
        }
    });

    var main_content = document.getElementsByClassName("tpc_content")[0].querySelectorAll('a,br');
    main_content.forEach(function(item, index){
        if(index+5 < main_content.length) {
            var nextEle = item.nextElementSibling;
            if(nextEle) {
                //nextEle.remove();
            }
            item.remove();
        }
    });

    var iframe_list = document.querySelectorAll("iframe");
    iframe_list.forEach(function(item, index){
      item.remove();
    });
})();