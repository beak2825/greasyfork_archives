// ==UserScript==
// @name         KAT - Mark All Forums As Read
// @namespace    MarkAllRead
// @version      1.0
// @description  Mark all forums as read
// @match        https://*.kat.cr/community/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20258/KAT%20-%20Mark%20All%20Forums%20As%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/20258/KAT%20-%20Mark%20All%20Forums%20As%20Read.meta.js
// ==/UserScript==

var ids = [4, 5, 20, 21, 24, 25, 26, 28, 29, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 45, 93, 94, 167, 174, 258, 259, 278, 323, 324, 325,
           334, 337, 351, 388, 399, 404, 508, 529, 530, 554, 626, 652, 669, 682, 692, 744, 769, 781, 792, 808, 851, 854, 901, 917, 950, 991,
           1012, 1037, 1057, 1137, 1163, 1288, 1307, 1363, 1491, 1575, 1642, 2324, 3457, 3530, 4024, 4025, 4026, 4028, 4032, 4330, 4441, 4574];

var arrLength = ids.length;

function markAll()
{
    for (var i = 0; i < arrLength; i++)
    {
        $.post("/community/read/" + ids[i] + "/");
    }
}

$('<a href="#" class="kaButton smallButton" id="markAllButton"><i class="ka ka-eye"></i> mark all forums as read</a>').insertAfter('.data:first');
$('#markAllButton').click(markAll);