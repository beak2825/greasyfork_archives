// ==UserScript==
// @name        auto_ref_thaieibvn
// @description auto ref = thaieibvn
// @namespace   *
// @version      0.2
// @include     **

// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/13237/auto_ref_thaieibvn.user.js
// @updateURL https://update.greasyfork.org/scripts/13237/auto_ref_thaieibvn.meta.js
// ==/UserScript==
function doText() {
   var url =window.location.href; 
   if (url.indexOf('?ref=thaieibvn')==-1 && url.length<30){
     window.location.assign(url+'/?ref=thaieibvn');
    //alert( );
   } 

}

doText();
//var myInterval = setInterval(doText, 500);

