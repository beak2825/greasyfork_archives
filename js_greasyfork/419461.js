// ==UserScript==
// @name        Fix HumbleBundle Blog "Buy Now" Link
// @namespace   Violentmonkey Scripts
// @match       http://blog.humblebundle.com/*
// @match       https://blog.humblebundle.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 12/31/2020, 2:08:32 PM
// @downloadURL https://update.greasyfork.org/scripts/419461/Fix%20HumbleBundle%20Blog%20%22Buy%20Now%22%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/419461/Fix%20HumbleBundle%20Blog%20%22Buy%20Now%22%20Link.meta.js
// ==/UserScript==

button = document.querySelector('a.wp-block-button__link.has-background');
button.href = button.href === '' ? button.rel : button.href;
button.rel = "nofollow";
button.target = "_blank";