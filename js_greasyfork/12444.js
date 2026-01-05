// ==UserScript==
// @name        IMGUR Load "remaining images" AUTOMATICALLY
// @namespace   Mikhoul
// @description Load "Remaining Images" Automatically
// @include     http://imgur.com/*
// @include     https://imgur.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12444/IMGUR%20Load%20%22remaining%20images%22%20AUTOMATICALLY.user.js
// @updateURL https://update.greasyfork.org/scripts/12444/IMGUR%20Load%20%22remaining%20images%22%20AUTOMATICALLY.meta.js
// ==/UserScript==


document.getElementsByClassName('post-loadall btn btn-action')[0].click() ;

