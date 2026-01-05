// ==UserScript==
// @name        Neg a fucker
// @namespace   Hash G.
// @description Neg a fucker r
// @include     *hackforums.net*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/11597/Neg%20a%20fucker.user.js
// @updateURL https://update.greasyfork.org/scripts/11597/Neg%20a%20fucker.meta.js
// ==/UserScript==

$(".menu > ul:nth-child(1) > li:nth-child(1)").after('<li><a class="navButton" onClick="autoNeg()" style="color: #4C9ED9;">Neg a fucker</a></li>');

var uidarr = [];
$("#boardstats_e > tr:nth-child(2) > td:nth-child(1) > span:nth-child(1)").find("a").each(function(index) {
	var href = $(this).attr("href");
	uidarr[index] = href.substring(56);
});
var uid = uidarr[Math.floor(Math.random() * uidarr.length)];

if (document.URL.indexOf("hguscript") !== -1) {
	$("#reputation").val(-3);
	$(".textbox").val("Meow dislike you.");
}

function autoNeg() {
	javascript:void window.open('http://www.hackforums.net/reputation.php?action=add&uid='+uid+'&pid=0&ref=hguscript','1438968873972','width=500,height=300,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
}
exportFunction(autoNeg, unsafeWindow, {defineAs: "autoNeg"});
