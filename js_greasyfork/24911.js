// ==UserScript==
// @name              Vurmin auto close thread
// @namespace         http://vurmin.co/*
// @description       closes open threads
// @version           1.0
// @license           GPL version 3 or any later version (http://www.gnu.org/copyleft/gpl.html)
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @author            Nenad__
// @icon              http://i.imgur.com/FtA1mnc.png
// @require           http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include           http://vurmin.co/showthread.php*
// @downloadURL https://update.greasyfork.org/scripts/24911/Vurmin%20auto%20close%20thread.user.js
// @updateURL https://update.greasyfork.org/scripts/24911/Vurmin%20auto%20close%20thread.meta.js
// ==/UserScript==
 
 
this.$ = this.jQuery = jQuery.noConflict(true);

function closeTab(){
    window.open('', '_self', '');
    window.close();
}
console.info("start");

var htmlString = $('body').html().toString();
var index = htmlString.indexOf("contains dead links");
if (index == -1) {
    console.log("Scanner: Posting dead links message");
    $("textarea#vB_Editor_QR_textarea").val("This thread contains dead links and it's moved to Trashcan. If you have fresh links for this topic, you must contact a staff member to restore this topic to the original section.");
    $("input#qr_submit").click();
    setTimeout(closeTab, 8500);
} else {
     setTimeout(closeTab, 5000);
}