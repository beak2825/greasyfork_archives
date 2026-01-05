// ==UserScript==
// @name       TopfaceRemover
// @namespace  https://vk.com/id104714424
// @author CoreOfRandom (vk.com/id104714424)
// @version    1.3
// @description  Remove popup messages from topface
// @match https://vk.topface.com/*
// @copyright CoreOfRandom
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/20669/TopfaceRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/20669/TopfaceRemover.meta.js
// ==/UserScript==

function remove( jQuery ) {
$( ".tf-overlay" ).remove();
$( ".unselectable" ).remove();
$( ".popup-header" ).hide();
$( ".popup-exp-new-button-wrapper" ).hide();
$( ".express-message-popup-text" ).remove();
$( ".express-message-popup-content" ).remove();
$( ".popup-exp-new-messages-text" ).remove();  
$( ".bsus-photo" ).remove();
$( ".popup-exp-new-messages-wrapper" ).hide();
$( ".action-close").css({"color": "red", "opacity":"1", "background":"red"});
$( "a.action-close").css({"color": "red", "opacity":"1"});
}

$(document).ready(remove);