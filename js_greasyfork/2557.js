// ==UserScript==
// @name        Zing Keys
// @namespace   DCI
// @include     https://backend.ibotta.com/*
// @version     1
// @grant       none
// @description x
// @downloadURL https://update.greasyfork.org/scripts/2557/Zing%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/2557/Zing%20Keys.meta.js
// ==/UserScript==

document.addEventListener( "keydown", kas, false);

function kas(i) {
     if ( i.keyCode == 65 ) { //A Key - No
     document.getElementById("duplicatefalse").click();
     document.getElementsByClassName('btn')[0].click()
}    
     if ( i.keyCode == 70 ) { //F Key - Yes
     document.getElementById("duplicatetrue").click();
     document.getElementsByClassName('btn')[0].click()
}
} 