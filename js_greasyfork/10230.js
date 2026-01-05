// ==UserScript==
// @name        Tripadvisor precise note
// @description Display the exact Tripadvisor note after the "bubbles"
// @namespace   KrisWebDev
// @author			KrisWebDev
// @include     http://www.tripadvisor.tld/*
// @include     https://www.tripadvisor.tld/*
// @version			1.4
// @grant       none
// @require			http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/10230/Tripadvisor%20precise%20note.user.js
// @updateURL https://update.greasyfork.org/scripts/10230/Tripadvisor%20precise%20note.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var coeff = 5;
var result = 0;
var sumReviews = 0;
var percentReviews = 0;

$(".reviews .row_count").each(function(index, val) {
  //console.log($(this).text());
  percentReviews = parseInt($(this).text().replace(/\s+/g, ''));
  result += percentReviews*coeff--;
  sumReviews +=  percentReviews;
});

if (sumReviews) {
  result = (Math.round(result/sumReviews*10))/10;
  $(".reviews .overallRating").text(result+" ");
}