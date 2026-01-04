// ==UserScript==
// @name Improved Inbox / Messages Page - eBay Australia
// @description This script improves the usability of the Inbox/Messages page within eBay. Adds support for middle/ctrl click and cleans up message list.
// @version 1.00
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=loveletslive7@gmail.com&item_name=Userscript - Improve eBay Messages
// @contributionAmount 5
// @namespace com.seifer7.improveebaymessages
// @match https://mesg.ebay.*.*/mesgweb/*
// @match https://mesg.ebay.*/mesgweb/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/383666/Improved%20Inbox%20%20Messages%20Page%20-%20eBay%20Australia.user.js
// @updateURL https://update.greasyfork.org/scripts/383666/Improved%20Inbox%20%20Messages%20Page%20-%20eBay%20Australia.meta.js
// ==/UserScript==

addcss('#emailRowView .msg-row td { white-space: normal !important; padding-top:5px; padding-bottom: 5px; line-height: normal; cursor: default;} #emailRowView .msg-row td a:link, #emailRowView .msg-row td a:visited { color: inherit; } #emailRowView tr.msg-read { color: #999; }')
jQuery('#emailRowView .msg-row td').off();
$msgsubjects = jQuery('#emailRowView .msg-row td[id$="sub"] div');
viewurl = jQuery("#viewMessageDetailsForm").attr('action');

$msgsubjects.each(function(index) {
  msgsubject = jQuery(this).html();
  msgid = jQuery(this).attr('id');
  msgid = msgid.split('_')[0];
  msgurl = viewurl + "/"+msgid;
  jQuery(this).html('<a href="'+msgurl+'">'+msgsubject+'</a>');
});


function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
}