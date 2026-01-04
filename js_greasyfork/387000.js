// ==UserScript==
// @name        [Amazon.co.jp] Hide Rows expect for kindle unlimited
// @description Kindle Unlimited以外の商品を隠す
// @version     0.3
// @author      takashi
// @match       https://www.amazon.co.jp/s?*
// @grant       none
// @namespace https://greasyfork.org/users/314232
// @downloadURL https://update.greasyfork.org/scripts/387000/%5BAmazoncojp%5D%20Hide%20Rows%20expect%20for%20kindle%20unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/387000/%5BAmazoncojp%5D%20Hide%20Rows%20expect%20for%20kindle%20unlimited.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var e = document.querySelectorAll('.a-button-oneclick');
  for (var i = e.length; i--;) {
    e.item(i).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
  }
})();