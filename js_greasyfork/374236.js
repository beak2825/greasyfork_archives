// ==UserScript==
// @name         Databazeknih.cz: hodnocení napravo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Protože přesunutí hodnocení nalevo je prasárna...
// @author       Jakub Rychecký <jakub@rychecky.cz>
// @match        https://www.databazeknih.cz/knihy/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license      WTFPL 2
// @downloadURL https://update.greasyfork.org/scripts/374236/Databazeknihcz%3A%20hodnocen%C3%AD%20napravo.user.js
// @updateURL https://update.greasyfork.org/scripts/374236/Databazeknihcz%3A%20hodnocen%C3%AD%20napravo.meta.js
// ==/UserScript==

(function() {
    var rightBar = $('#right_more');


    // Ratings and its style edits
    var rating = $('#voixis');
    rating.find('div').css({
       'padding': '10px 15px',
       'margin-top': '70px'
    });

    // My ratings
    var stars = $('#left_less .stars');



    // Move ratings to the right
    rating.insertBefore(rightBar.find('h3:first'));
    stars.insertBefore(rightBar.find('h3:first'));

    // Ads removal
    rightBar.find('.im_square').remove();
})();