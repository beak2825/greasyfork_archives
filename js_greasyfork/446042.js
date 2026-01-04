// ==UserScript==
// @name        Kagi redirection to Google for free tier
// @namespace   https://kagi.com/
// @match       https://kagi.com/?q=*
// @description The script clicks the search on google button when the max free searches on kagi are reached.
// @version     1.0
// @noframes
// @grant       none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/446042/Kagi%20redirection%20to%20Google%20for%20free%20tier.user.js
// @updateURL https://update.greasyfork.org/scripts/446042/Kagi%20redirection%20to%20Google%20for%20free%20tier.meta.js
// ==/UserScript==

(function () {
  'use strict';
  
	var googButton = document.querySelectorAll('form.search-form button[formaction*="google"]');

  if(googButton.length != 1) {
    console.error('googButton is more than 1 selected element, ' + googButton.length);

    if(googButton.length == 0) {
      throw 'No button found';
    }
  }   

  console.error('googButton is more than 1 selected element, ' + googButton.length);
  
  googButton[0].click();
}());
