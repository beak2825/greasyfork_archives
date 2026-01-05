// ==UserScript==
// @name        KAT - Check Latest Threads
// @namespace   CheckLatestThreads
// @version     1.00
// @description Flags latest threads with link at the start (known spammer pattern)
// @include     https://*kat.cr/community/
// @downloadURL https://update.greasyfork.org/scripts/14559/KAT%20-%20Check%20Latest%20Threads.user.js
// @updateURL https://update.greasyfork.org/scripts/14559/KAT%20-%20Check%20Latest%20Threads.meta.js
// ==/UserScript==

$(".data:first .cellMainLink").each(function()
{ 
    if ($(this).text().search("http://") == 0) { $('<span style="float:right; border:2px solid red; color:white; background-color:red; font-weight:bold">Potential Spam</span>').insertAfter(this); }
});