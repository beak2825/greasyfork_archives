// ==UserScript==
// @name         Torn NoConfirm Revive
// @namespace    namespace
// @version      0.2
// @description  description
// @author       tos
// @match        *.torn.com/profiles.php*
// @match        *.torn.com/hospitalview.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460741/Torn%20NoConfirm%20Revive.user.js
// @updateURL https://update.greasyfork.org/scripts/460741/Torn%20NoConfirm%20Revive.meta.js
// ==/UserScript==

$( document ).ajaxSend(function(event, jqXHR, ajaxObj) {
  if(ajaxObj.url) ajaxObj.url = ajaxObj.url.replace('action=revive', 'action=revive&step=revive')
})