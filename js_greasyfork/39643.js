// ==UserScript==
// @name        Twitter na Wykopie
// @namespace   twitternawykopie
// @description Odkrywa bez klikania wpisy z Twittera
// @include     https://*.wykop.pl/*
// @author      matixrr
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/39643/Twitter%20na%20Wykopie.user.js
// @updateURL https://update.greasyfork.org/scripts/39643/Twitter%20na%20Wykopie.meta.js
// ==/UserScript==

function show_twitter() {
$('div:not(.no-description) > a > div.twitter-cover').click();
}

show_twitter();

$(document).ajaxComplete(function() {
show_twitter();
});