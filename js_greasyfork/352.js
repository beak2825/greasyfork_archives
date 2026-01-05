// ==UserScript==
// @name        Eishockeyforum - Links in alten Zitaten
// @description Repariert die alten Links in den Zitaten
// @namespace   ehf neu
// @include     http://www.eishockeyforum.at/index.php/Thread/*
// @grant       none
// @version     20150727
// @downloadURL https://update.greasyfork.org/scripts/352/Eishockeyforum%20-%20Links%20in%20alten%20Zitaten.user.js
// @updateURL https://update.greasyfork.org/scripts/352/Eishockeyforum%20-%20Links%20in%20alten%20Zitaten.meta.js
// ==/UserScript==

var regex = /index\.php\?page\=Thread\&(amp\;|)p/ig;
var replace = "index\.php\/Thread\/\?p";

$(document).ready(function(){
  $("blockquote.quoteBox").each(function() {
  var _cite = $(this).attr("cite"); 
  $(this).attr("cite", _cite.replace(regex, replace));
  });
  $("blockquote.quoteBox").children("header").children("h3").children("a").each(function() {
  var _href = $(this).attr("href"); 
  $(this).attr("href", _href.replace(regex, replace));
  });
});