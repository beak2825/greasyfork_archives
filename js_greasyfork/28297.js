// ==UserScript==
// @name          unso notifier
// @version       1.2
// @namespace      P
// @description    asdasdasd
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=unsolved
// @grant       GM_notification
// @grant       window.focus
// @icon      https://ea1-api.asm.skype.com/v1/objects/0-ea-d4-363e13717f07b46e8e663388ef174277/views/avatar_fullsize

// @downloadURL https://update.greasyfork.org/scripts/28297/unso%20notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/28297/unso%20notifier.meta.js
// ==/UserScript==

var strHTML = document.body.innerHTML;
var yourTime = new Date();


var notificationDetails = {
    text: '^^',
    title: '❤ ♥ ♡ ÔNG BÀ 8 ♡ ♥ ❤',/*ஜ۩۞۩ஜ ÔNG BÀ 8ஜ۩۞۩ஜ*/
    timeout: 5000,
    onclick: function() { window.focus(); },
  };


if((strHTML.indexOf("ERROR_QUEUE_EMPTY") < 0) & strHTML.indexOf("HTTP ERROR 500")<0){
    GM_notification(notificationDetails);
} else { 
 window.setTimeout(function(){window.location.reload() ;},3500) ;
} 
return;