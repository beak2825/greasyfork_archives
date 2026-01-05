// ==UserScript==
// @name MALTest 2
// @description Bypasses the 30 character limit by appending the zero-width non joiner to your text
// @author lequack
// @license GPL v3
// @include http://myanimelist.net/forum/*
// @version 0.0.1.20151225161655
// @namespace https://greasyfork.org/users/24695
// @downloadURL https://update.greasyfork.org/scripts/15548/MALTest%202.user.js
// @updateURL https://update.greasyfork.org/scripts/15548/MALTest%202.meta.js
// ==/UserScript==

$('#postReply').bind('click.mynamespace', function() { 
    var text = $('#messageText');
    text.val(text.val() + ' ‌‌‌‌ ‌‌‌‌ ‌‌‌‌‌‌‌‌ ‌‌‌‌ ‌‌‌‌ ‌‌‌‌');
    window.open('/info.php?go=bbcode','bbcode','menubar=no,scrollbars=yes,status=no,width=600,height=700');
});