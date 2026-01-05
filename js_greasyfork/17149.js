// ==UserScript==
// @name        alipay-hide-cvv2
// @namespace   hypermedia
// @include     https://*alipay*
// @description alibaba aliexpress alipay hide secure CVV2 data
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17149/alipay-hide-cvv2.user.js
// @updateURL https://update.greasyfork.org/scripts/17149/alipay-hide-cvv2.meta.js
// ==/UserScript==



document.getElementsByName("cvv2")[0].type="password";
