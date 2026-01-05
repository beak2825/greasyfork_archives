// ==UserScript==
// @name        reddit: add subscriber class to body
// @namespace   mailto:morten.with@gmail.com
// @locale      en
// @include     *reddit.com/r/*
// @version     0.2
// @run-at      document-start
// @grant       none
// @description adds subscriber class to body
// @downloadURL https://update.greasyfork.org/scripts/25266/reddit%3A%20add%20subscriber%20class%20to%20body.user.js
// @updateURL https://update.greasyfork.org/scripts/25266/reddit%3A%20add%20subscriber%20class%20to%20body.meta.js
// ==/UserScript==

(function()
{
'use strict';

document.addEventListener("DOMContentLoaded", function()
{
var body = document.getElementsByTagName("body");

// from https://stackoverflow.com/a/15226442
if((new RegExp('(\\s|^)' + "subscriber" + '(\\s|$)').test(body[0].className)) === false)
{
    body[0].className += " subscriber";
}
});
})();
