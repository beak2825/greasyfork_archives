// ==UserScript==
// @name         Wish.com login nag remover
// @namespace    https://greasyfork.org/en/users/215602
// @version      0.1
// @description  Just removes the Wish.com login popup nag
// @author       You
// @match        *://www.wish.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375007/Wishcom%20login%20nag%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/375007/Wishcom%20login%20nag%20remover.meta.js
// ==/UserScript==
$('.sc-188teto-0-BaseModal__PlainBackDrop-dRLQsm').remove();