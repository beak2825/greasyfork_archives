// ==UserScript==
// @name         hide globalsearch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hide global search from telegram web
// @author       You
// @match        https://web.telegram.org/
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420808/hide%20globalsearch.user.js
// @updateURL https://update.greasyfork.org/scripts/420808/hide%20globalsearch.meta.js
// ==/UserScript==
var $ = window.jQuery;
$(function(){
    $('.im_dialogs_contacts_wrap[ng-show="foundPeers.length > 0"]').hide();
    $('.composer_rich_textarea').attr('placeholder','הקלד/י הודעה');
    $('.composer_rich_textarea').attr("dir", "rtl");
    $('.im_send_panel_wrap').css('max-width','100%');
    $('.im_send_form').css('max-width','100%');

   $(document).on('click mouseup mousedown',function(){
       $('.composer_rich_textarea').attr('placeholder','הקלד/י הודעה');
setTimeout(function() { $('.composer_rich_textarea').attr('placeholder','הקלד/י הודעה'); }, 10);

    });
});
