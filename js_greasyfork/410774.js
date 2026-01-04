// ==UserScript==
// @name         Torn NoConfirm Bust
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/jailview.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410774/Torn%20NoConfirm%20Bust.user.js
// @updateURL https://update.greasyfork.org/scripts/410774/Torn%20NoConfirm%20Bust.meta.js
// ==/UserScript==

$( document ).ajaxSend(function(event, jqXHR, ajaxObj) {
  if(ajaxObj.url) ajaxObj.url = ajaxObj.url.replace(/breakout\d?/g, 'breakout1')
})