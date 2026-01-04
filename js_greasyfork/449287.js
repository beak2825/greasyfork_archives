// ==UserScript==
// @name         shopee auto get
// @namespace    https://greasyfork.org/zh-TW/users/234408-kfoawf
// @version      0.1
// @description  auto get
// @author       kfoawf
// @match        *://shopee.tw/shopee-coins
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/449287/shopee%20auto%20get.user.js
// @updateURL https://update.greasyfork.org/scripts/449287/shopee%20auto%20get.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


setTimeout(function(){
    $('.pcmall-dailycheckin_3uUmyu').click();
}, 5000);
