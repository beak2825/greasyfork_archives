// ==UserScript==
// @name Bypass 30 char limit rule on MAL
// @description Bypasses the 30 character limit by appending the zero-width non joiner to your text
// @author lequack
// @license GPL v3
// @include http://myanimelist.net/forum/*
// @version 0.0.1.20151224141446
// @namespace https://greasyfork.org/users/24695
// @downloadURL https://update.greasyfork.org/scripts/15509/Bypass%2030%20char%20limit%20rule%20on%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/15509/Bypass%2030%20char%20limit%20rule%20on%20MAL.meta.js
// ==/UserScript==

$(function () {
    $('#postReply').on('click', function () {
        var text = $('#messageText');
        text.val(text.val() + ' ‌‌‌‌ ‌‌‌‌ ‌‌‌‌‌‌‌‌ ‌‌‌‌ ‌‌‌‌ ‌‌‌‌');    
    });
});