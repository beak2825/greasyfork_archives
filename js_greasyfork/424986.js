// ==UserScript==
// @name     RYM Review Hider
// @version  1.02
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    none
// @description  Tired of letting other people's opinions influence your own? This simple userscript hides other user's ratings by default. Already rated a release and want to see what others said? Just press the toggle rating data button.
// @match    https://rateyourmusic.com/release/*
// @match    http://rateyourmusic.com/release/*
// @match    http://rateyourmusic.com/artist/*
// @match    https://rateyourmusic.com/artist/*
// @namespace https://greasyfork.org/users/758717
// @downloadURL https://update.greasyfork.org/scripts/424986/RYM%20Review%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/424986/RYM%20Review%20Hider.meta.js
// ==/UserScript==

var rating = $('.avg_rating').text();
var hidden = true;
//var url = window.location.href;

if (!window.location.href.includes("/reviews/") && !window.location.href.includes("/artist/")) {
    $('.section_reviews').hide();
    $('.avg_rating').text("?");
    $('.section_catalog').hide();
    $('.section_my_catalog').append("<div class='review_btn' id='toggle_reviews'>Click to show rating data</div>");
    $('#toggle_reviews').css({"margin": "auto", "display": "block", "background-image": "initial"});
    
    $('#toggle_reviews').on('click', function() {
      hidden == true ? hidden = false : hidden = true;
      $('#toggle_reviews').text(hidden ? "Click to show rating data" : "Click to hide rating data");
      $('.section_reviews').toggle();
      $('.section_catalog').toggle();
      $('.avg_rating').text() == "?" ? $('.avg_rating').text(rating) : $('.avg_rating').text("?");
    });
}


else if (window.location.href.includes("/artist/")) {
  	let ratings = [];
  	let i = 0;
  
    $('.disco_avg_rating').each(function() {ratings.push($(this).text()); $(this).text("?");});
    $('.section_artist_discography').prepend("<div class='disco_cat' id='toggle_reviews'>Click to show ratings</div>");
    $('#toggle_reviews').css({"float": "none"});
  
    $('#toggle_reviews').on('click', function() {
      hidden = !hidden;
      $('#toggle_reviews').text(hidden ? "Click to show ratings" : "Click to hide ratings");
      if (!hidden) {
        $('.disco_avg_rating').each(function() {
          $(this).text(ratings[i]);
          i++;
        });
        i = 0;
      }
      else {
        console.log("in else");
        $('.disco_avg_rating').text("?");
      }
    });
}

