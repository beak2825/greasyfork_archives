// ==UserScript==
// @name         Indeed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.indeed.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/30478/Indeed.user.js
// @updateURL https://update.greasyfork.org/scripts/30478/Indeed.meta.js
// ==/UserScript==

$(document).ready(function(){
$("div.row.result").has("a:contains('Saved')").hide();
    $("div.row.result").has("a:contains('Applied')").hide();
    // Your code here...
});