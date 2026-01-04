// ==UserScript==
// @name        Remove Gelbooru Nag
// @namespace   namespace
// @include     https://gelbooru.com/*
// @version     3.1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Removes Gelbooru AD-Blocking nag
// @downloadURL https://update.greasyfork.org/scripts/393755/Remove%20Gelbooru%20Nag.user.js
// @updateURL https://update.greasyfork.org/scripts/393755/Remove%20Gelbooru%20Nag.meta.js
// ==/UserScript==
$('#searchTags > center').remove();
$('body > div.padding15 > div.contain-push > div:nth-child(3)').remove();
$('body > div.padding15 > div.contain-push > div:nth-child(2)').remove();
$('body > div.contain-push > div:nth-child(43) > a > img').remove();
