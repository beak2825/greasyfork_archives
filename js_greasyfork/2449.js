// ==UserScript==
// @name        remove Premium spam
// @namespace   hearthstone
// @description Removes annoying premium articles
// @include     http://hearthstoneplayers.com/*
// @version     1
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/2449/remove%20Premium%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/2449/remove%20Premium%20spam.meta.js
// ==/UserScript==
//From your very special friend: manghoti

$('article').has('.meta-premium').hide();
$('#main-premium-guides').hide();
$('.guide-box').has('.filter-premium').css('visibility', 'hidden')