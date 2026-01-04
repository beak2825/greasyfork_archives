// ==UserScript==
// @name           {Mobile Metacritic arrange}
// @namespace      {metacritic.com}
// @author         {your name}
// @match        https://*.metacritic.com/movie/*
// @exclude        https://*.metacritic.com/movie/*/critic-reviews
// @description    {Userscript description}
// @include        *
//		https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_match-pattern
//		
// @clean-include       (true || false)
// if it's > true < , USI will not change any of your @includes
// 
// @info                {more informations ...}
// @run-at              (document-end || document-start || document-ready)
// @include-jquery true
// @use-greasemonkey true
// @version             1.0.2
// @downloadURL https://update.greasyfork.org/scripts/30756/%7BMobile%20Metacritic%20arrange%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/30756/%7BMobile%20Metacritic%20arrange%7D.meta.js
// ==/UserScript==

$("div.review.critic:contains(Mick LaSalle)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Peter Travers)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Michael Phillips)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Roger Moore)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Lisa Schwarzbaum)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Kenneth Turan)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Manohla Dargis)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(David Edelstein)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Glenn Kenny)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Dana Stevens)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Anthony Lane)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Matt Zoller Seitz)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Wesley Morris)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Joe Morgenstern)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Todd McCarthy)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(A.O. Scott)").insertBefore( $("div.review.critic:eq(0)"));
      $("div.review.critic:contains(Gene Siskel)").insertBefore( $("div.review.critic:eq(0)"));
          $("div.review.critic:contains(James Berardinelli)").insertBefore( $("div.review.critic:eq(0)"));
$("div.review.critic:contains(Roger Ebert)").insertBefore( $("div.review.critic:eq(0)"));
    
// Your code here