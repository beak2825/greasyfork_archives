// ==UserScript==
// @name        Check remember me
// @namespace   GreasyFork
// @description Check Remember me on Sign In GreasyFork page
// @include     https://greasyfork.org/*/users/sign_in*
// @version     1.0
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=19641
// @downloadURL https://update.greasyfork.org/scripts/12592/Check%20remember%20me.user.js
// @updateURL https://update.greasyfork.org/scripts/12592/Check%20remember%20me.meta.js
// ==/UserScript==

function check(jNode) {
	$("#user_remember_me").attr('checked', true); 
}
waitForKeyElements( "#user_remember_me", check );

function check2(jNode) {
	$("#remember_me").attr('checked', true); 
}
waitForKeyElements( "#remember_me", check2 );