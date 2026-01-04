// ==UserScript==
// @name        Metacritic arrange
// @namespace   http://tampermonkey.net/
// @include     http://*.metacritic.com/*/*/critic-reviews
// @description  try to take over the world!
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30754/Metacritic%20arrange.user.js
// @updateURL https://update.greasyfork.org/scripts/30754/Metacritic%20arrange.meta.js
// ==/UserScript==


(function() {
    
    'use strict';

    $(window).load(function(){
    
     //$("li.review.critic_review.first_review").insertBefore( $("div#site_layout"));   
    
   //   $("div#site_layout").remove();
     // $("ul.tabs.tabs_type_1").remove();
      //$("li.review_action.author_reviews").remove();
      //$("div.metascore_w.medium.movie.positive.indiv.perfect").append('<div id=space style="width:100%;  height:1px; margin-top:3px; ">');
      //$("div.review_body").append('<div id=space style="width:100%;  height:1px; margin-top:2px; ">');
      //$("li.review_action.full_review").append('<div id=space style="width:100%; background-color: grey; height:1px; margin-top:3px; ">');
    
       $("div.review.pad_top1.pad_btm1:contains(Mick LaSalle)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Peter Travers)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Michael Phillips)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Roger Moore)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Lisa Schwarzbaum)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Kenneth Turan)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Manohla Dargis)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(David Edelstein)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Glenn Kenny)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Dana Stevens)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Anthony Lane)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Matt Zoller Seitz)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Wesley Morris)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Joe Morgenstern)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Todd McCarthy)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(A.O. Scott)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
      $("div.review.pad_top1.pad_btm1:contains(Gene Siskel)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
          $("div.review.pad_top1.pad_btm1:contains(James Berardinelli)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));
$("div.review.pad_top1.pad_btm1:contains(Roger Ebert)").insertBefore( $("div.review.pad_top1.pad_btm1:eq(0)"));

    });
 /*
    */
    // Your code here...
})();