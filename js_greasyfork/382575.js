// ==UserScript==
// @name         Randaris nanoids player temporary fix the https issue 03.05.2019
// @version      1
// @include      https://randaris.app/serie/episode/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description  !!!! Only works for Firefox, change in about:config security.mixed_content.block_active_content FALSE !!!!
// @namespace https://greasyfork.org/users/297963
// @downloadURL https://update.greasyfork.org/scripts/382575/Randaris%20nanoids%20player%20temporary%20fix%20the%20https%20issue%2003052019.user.js
// @updateURL https://update.greasyfork.org/scripts/382575/Randaris%20nanoids%20player%20temporary%20fix%20the%20https%20issue%2003052019.meta.js
// ==/UserScript==

(function($) {
 $.fn.uncomment = function() {
  for (var i = 0, l = this.length; i < l; i++) {
   for (var j = 0, len = this[i].childNodes.length; j < len; j++) {
    if (this[i].childNodes[j].nodeType === 8) {
     var content = this[i].childNodes[j].nodeValue;
     $(this[i].childNodes[j]).replaceWith(content);
    }
   }
  }
 };
})(jQuery);

(function($) {
 $.fn.grablink = function() {
  for (var i = 0, l = this.length; i < l; i++) { //loop every .video-player
   for (var j = 0, len = this[i].childNodes.length; j < len; j++) { //loop all child nodes
    if (this[i].childNodes[j].nodeType === 1 && done == false) {
     if ($(this[i].childNodes[j]).attr("href") != null && $(this[i].childNodes[j]).text() === "VIDEO STARTEN") {
       console.log("Found Element <A> with href = " + $(this[i].childNodes[j]).attr("href")); // http://nanoids.in/index.php/embed/52967276d422c4533e3ec639e8812fd7/94543583348
       this[i].childNodes[j].style.display = 'none'; //Hide "Video Starten" link box
       link = $(this[i].childNodes[j]).attr("href");
 			 $(".video-player").uncomment();
       $("#nanoidsFrame").changelink();
      }
    }
   }
  }
 };
})(jQuery);

(function($) {
 $.fn.changelink = function() {
  for (var i = 0, l = this.length; i < l; i++) {
   if (this[i].nodeType === 1) {
    if ($(this[i]).attr("src") != null) {
     var content = $(this[i]).attr("src");
     console.log("Found <iframe> with src = " + content);
     var newUrl = link.replace("https://", "http://");
     $(this[i]).attr("src", newUrl);
     done = true;
    }
   }
  }
 };
})(jQuery);

var link = "nothing";
var done = false;

$(document).ready(function() {
 $(".video-player").grablink();
});