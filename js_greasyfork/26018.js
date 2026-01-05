// ==UserScript==
// @name Facebook Auto "Most Recent" Stories
// @version	1.0
// @author Hélder Ferreira
// @namespace https://greasyfork.org/users/89591
// @homepageURL https://greasyfork.org/en/scripts/26018-facebook-auto-most-recent-stories/
// @description	Change Facebook feed to "Most Recent" Stories
// @icon http://i.imgur.com/WpjyLA4.png
// @match *://www.facebook.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/26018/Facebook%20Auto%20%22Most%20Recent%22%20Stories.user.js
// @updateURL https://update.greasyfork.org/scripts/26018/Facebook%20Auto%20%22Most%20Recent%22%20Stories.meta.js
// ==/UserScript==

$(window).ready(function(){
  var url=$(location).attr("href");
  var h_chr="https://www.facebook.com/?sk=h_chr";
  var h_nor="https://www.facebook.com/?sk=h_nor";
  var logo="https://www.facebook.com/?ref=logo";
  
  if(url == h_nor){
    window.location.replace(h_chr);
  }
  if(url == logo){
    window.location.replace(h_chr);
  }
  else if(url == "https://www.facebook.com/"){
    window.location.replace(h_chr);
  }
  
  $("[data-click='bluebar_logo'] > a").attr("href", h_chr);
});