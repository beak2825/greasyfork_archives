/*Adds eBay friendly html image links to imgur again
By nascent

Changelog

* 1.00 * 2.13 Ininial Release
*/

// ==UserScript==
// @name        ImgurEbayLinkifier
// @description Adds eBay friendly html image links to imgur again.
// @version     1.00
// @namespace   https://greasyfork.org/en/users/8813-nascent
// @include     http://*imgur.com/*
// @include     https://*imgur.com/*
// @downloadURL https://update.greasyfork.org/scripts/16118/ImgurEbayLinkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/16118/ImgurEbayLinkifier.meta.js
// ==/UserScript==

var my_div = document.getElementById('share_link')
//my_div.innerHTML = 'Some other value'
my_div.innerHTML = '<input class="share-link" readonly="" value="http://google.com" type="text" data-reactid=".0.1.1.0.0.1.1" style="background-color: rgb(37, 37, 37);">'