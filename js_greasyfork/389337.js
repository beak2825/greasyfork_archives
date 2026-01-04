// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://old.reddit.com/message/unread/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389337/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/389337/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery; //Need for Tampermonkey or it raises warnings.
    var i;

//setTimeout(
//  function()
//  {
for (i = 0; i < $(".author").length; i++) {
  if ($(".author").eq(i).text() == "wawwawawawawaw") //Username to look for here
  {
	$(".buttons").eq(i).children().eq(6).children().click(); //CLICK REPLY
	$("textarea").eq(i + 1).val("Sure thing darling, try again 😘😘"); //ENTER TEXT
	$(".save").eq(i + 1).click(); //CLICK SAVE


	//$(".tagline").eq(i).parent().children().eq(3).children().eq(5).children().eq(0).click(); //Click reply
	//$(".usertext-edit").eq(1).children().eq(0).children().eq(0).val("Sure thing darling, try again 😘😘"); //Reply to post
	//$(".usertext-edit").eq(1).children().eq(1).children().eq(20).children().eq(0).click(); //Click on "Save"
  }
}
//  }, 5000);

})();