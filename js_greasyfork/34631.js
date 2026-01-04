// ==UserScript==
// @name               ScreenRant Comments [DEPRECATED]
// @namespace          https://greasyfork.org/en/users/105361-randomusername404
// @description        Brings back an icon to go straight to the comment section on ScreenRant.
// @include            *://screenrant.com/*
// @exclude            *://screenrant.com/
// @exclude            *://screenrant.com/sr-originals/*
// @exclude            *://screenrant.com/movie-news/*
// @exclude            *://screenrant.com/tv-news/*
// @exclude            *://screenrant.com/movie-reviews/*
// @exclude            *://screenrant.com/video/*
// @exclude            *://screenrant.com/lists/*
// @exclude            *://screenrant.com/movie-trailers/*
// @exclude            *://screenrant.com/podcasts/*
// @exclude            *://screenrant.com/tag/*
// @exclude            *://screenrant.com/new-movies/*
// @exclude            *://screenrant.com/comics/*
// @exclude            *://screenrant.com/gaming/*
// @version            1.01
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.2.1.min.js
// @author             RandomUsername404
// @grant              none
// @icon               https://screenrant.com/wp-content/themes/screenrant/images/sr-touch-icon-144x144.png
// @downloadURL https://update.greasyfork.org/scripts/34631/ScreenRant%20Comments%20%5BDEPRECATED%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/34631/ScreenRant%20Comments%20%5BDEPRECATED%5D.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function () {
      var chatButton = document.createElement("img");
	  chatButton.src = "http://svgshare.com/i/3c0.svg";
	  var width = - ( $(window).width() / 2 ) + ($(window).width() * 0.0875);
	  $(chatButton).css( {"position":"fixed","height":"50px","bottom":"3px","right":width + "px","z-index":"2"} );
      $("html").append(chatButton);

      chatButton.onclick = function() {
          window.location = window.location+"#comments";
          location.reload(true);
      };
});
