// ==UserScript==
// @name	  RB.com
// @namespace	  https://greasyfork.org/users/4390-seriousm
// @description   Direct image display
// @match         http://redblow.com/*
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/4049/RBcom.user.js
// @updateURL https://update.greasyfork.org/scripts/4049/RBcom.meta.js
// ==/UserScript==

jQuery('img.attachment-medium').each(function(ix, element){
   var $element = jQuery(element);
   $element.parent().attr('href', $element.attr('src').replace(/(-\d+x\d+)/, ''));
});