// ==UserScript==
// @name         A9 image difference
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Samburger
// @include      /^https://(www|s3)\.(mturkcontent|amazonaws)\.com/
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/25379/A9%20image%20difference.user.js
// @updateURL https://update.greasyfork.org/scripts/25379/A9%20image%20difference.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByName("sizeCount")[1].click();
    document.getElementsByName("flavorScent")[1].click();
    document.getElementsByName("sameBrand")[1].click();
    document.getElementsByName("sameLogo")[1].click();
    document.getElementsByName("sameEdition")[1].click();
    document.getElementsByName("sameLanguage")[1].click();
    document.getElementsByName("samePackage")[1].click();
    document.getElementsByName("sameProduct")[1].click();
})();

window.focus();

$(document).keydown(function (e) {
    switch (e.which) {
          case 97: // Numpad 1
		  document.getElementsByName("sizeCount")[0].click();
		  break;
          case 98: // Numpad 2
		  document.getElementsByName("flavorScent")[0].click();
		  break;
          case 99: // Numpad 3
		  document.getElementsByName("sameBrand")[0].click();
		  break;
          case 100: // Numpad 4
		  document.getElementsByName("sameLogo")[0].click();
		  break;
          case 101: // Numpad 5
		  document.getElementsByName("sameEdition")[0].click();
		  break;
          case 102: // Numpad 6
		  document.getElementsByName("sameLanguage")[0].click();
		  break;
          case 103: // Numpad 7
		  document.getElementsByName("samePackage")[0].click();
		  break;
          case 104: // Numpad 8
		  document.getElementsByName("sameProduct")[0].click();
		  break;
          case 13: // Enter or f
		  $('#submitButton').click();
		  break;
	  }
	});