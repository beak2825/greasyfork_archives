// ==UserScript==
// @name        KAT - Fix https yuq.me problem
// @namespace   Dr.YeTii
// @include     https://kat.cr/*
// @version     1
// @grant       none
// @description Bugfix for broken yuq.me images
// @downloadURL https://update.greasyfork.org/scripts/12744/KAT%20-%20Fix%20https%20yuqme%20problem.user.js
// @updateURL https://update.greasyfork.org/scripts/12744/KAT%20-%20Fix%20https%20yuqme%20problem.meta.js
// ==/UserScript==

$('img[src^="//yuq.me"]').each(function() {
  $(this).attr('src', 'http:'+$(this).attr('src'));
});