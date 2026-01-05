// ==UserScript==
// @name        MyLikes Keys
// @namespace   DCI
// @include     https://s3.amazonaws.com/mylikes*
// @version     1
// @description x
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2547/MyLikes%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/2547/MyLikes%20Keys.meta.js
// ==/UserScript==

document.addEventListener( "keydown", kas, false);

function kas(i) {
     if ( i.keyCode == 65 ) { //A Key - Mature
     document.getElementById("submit_mature").click();
}    
     if ( i.keyCode == 70 ) { //F Key - Safe
     document.getElementById("submit_safe").click();
}
} 