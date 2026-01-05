// ==UserScript==
// @name        amazon book
// @namespace   amazonbook
// @description display only title and description
// @include     http://astore.amazon.com/httpawesomenc-20/detail/*
// @version     1
// @grant       none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/10079/amazon%20book.user.js
// @updateURL https://update.greasyfork.org/scripts/10079/amazon%20book.meta.js
// ==/UserScript==


$(document).ready(function(){

  console.log("greasemonkey loaded");
  jQuery("#mainwrap").hide(); 
  jQuery("#sidebar").hide(); 
  
  
  jQuery("#titleAndByLine h2 span").remove()
  var title = jQuery("#titleAndByLine h2").text();
  jQuery("#productDescription h2").remove()
  var desc = jQuery("#productDescription").text();
  
  jQuery("#wrap").append("<h2>"+title+"</h2>");
  jQuery("#wrap").append("<p id='desc'>"+desc+"</p>");

});