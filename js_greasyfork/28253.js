// ==UserScript==
// @name          lock unso favicon chotot
// @version       2.3
// @namespace      P
// @description    fuck unso n get $
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=unsolved
// @downloadURL https://update.greasyfork.org/scripts/28253/lock%20unso%20favicon%20chotot.user.js
// @updateURL https://update.greasyfork.org/scripts/28253/lock%20unso%20favicon%20chotot.meta.js
// ==/UserScript==

var strHTML = document.body.innerHTML;
var yourTime = new Date();

document.head = document.head || document.getElementsByTagName('head')[0];

function changeFavicon(src) {
 var link = document.createElement('link'),
     oldLink = document.getElementById('dynamic-favicon');
 link.id = 'dynamic-favicon';
 link.rel = 'shortcut icon';
 link.href = src;
 if (oldLink) {
  document.head.removeChild(oldLink);
 }
 document.head.appendChild(link);
}


if((strHTML.indexOf("ERROR_QUEUE_EMPTY") < 0) & strHTML.indexOf("HTTP ERROR 500")<0){
    changeFavicon("https://www.chotot.com/chotot-img/favicon.ico");
} else { 
 window.setTimeout(function(){window.location.reload() ;},3500) ;
    document.head.removeChild(link);
} 
return;