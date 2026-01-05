// ==UserScript==
// @name        Gmail - Remove "Empty Trash Now" link
// @namespace   gmail_remove_empy_trash_now_link
// @description Removes the "Empty Trash Now" link when in the Trash
// @version     0.1
// @author	Tim Berneman
// @copyright	Tim Berneman (c) 2015
// @include     /https?:\/\/mail.google.com\/mail\/u\/0\/#trash/
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js
// @run-at      document-start
//
// License: http://creativecommons.org/licenses/by-nc-sa/3.0/
//
// CHANGELOG:
// v0.1 - initial release
//
// @downloadURL https://update.greasyfork.org/scripts/12050/Gmail%20-%20Remove%20%22Empty%20Trash%20Now%22%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/12050/Gmail%20-%20Remove%20%22Empty%20Trash%20Now%22%20link.meta.js
// ==/UserScript==

// THESE DO NOT WORK FOR THIS SCRIPT!
//
// window.addEventListener ("load", pageFullyLoaded);
// document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
// $(document).ready(function() {} );
//
// I suspect Gmail is loading this particular code through AJAX and thus the above statements do not work.
//
// To circumvent this, I wait 3 seconds then call the function to hide the div. (Kludgy, I know, but it works!)

function yourFunction() {

  if ( jQuery("div.ya") == null ) {
    setTimeout(function() { yourFunction(); }, 1000);
  } else {
    jQuery('span:contains("Empty Trash now")').parent().hide();
  }

}
setTimeout(function() { yourFunction(); }, 3000);