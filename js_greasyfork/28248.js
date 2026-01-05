// ==UserScript==
// @name          lock unso
// @version       1
// @namespace      P
// @description    fuck unso n get $
// @include        *https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=unsolved
// @downloadURL https://update.greasyfork.org/scripts/28248/lock%20unso.user.js
// @updateURL https://update.greasyfork.org/scripts/28248/lock%20unso.meta.js
// ==/UserScript==

var strHTML = document.body.innerHTML;
var yourTime = new Date();


if((strHTML.indexOf("ERROR_QUEUE_EMPTY") < 0) & strHTML.indexOf("HTTP ERROR 500")<0){
 alert("reload lại trang"); 
} else { 
 window.setTimeout(function(){window.location.reload() ;},3500) ;
} 
return;