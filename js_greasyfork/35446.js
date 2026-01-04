// ==UserScript==
// @name        animezone disable antiadblock
// @namespace   dtm
// @include     http://www.animezone.pl/odcinki-online/*
// @description blokuje antyadblocka
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35446/animezone%20disable%20antiadblock.user.js
// @updateURL https://update.greasyfork.org/scripts/35446/animezone%20disable%20antiadblock.meta.js
// ==/UserScript==

$(document).ready(function(){
  $('.play').prop('disabled', false).prop('title', 'Oglądaj').text('Oglądaj');  
});