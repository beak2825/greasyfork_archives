// ==UserScript==
// @name         Trakt Average Season Rating
// @namespace    https://greasyfork.org/en/scripts/30728-trakt-average-season-rating
// @version      0.2
// @description  Trakt.tv average season rating counter.
// @author       Tusk
// @match        https://trakt.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30728/Trakt%20Average%20Season%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/30728/Trakt%20Average%20Season%20Rating.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function run_script() {
    if(window.location.pathname.indexOf('seasons') > -1) {
        season_rating();
    }else if(window.location.pathname.indexOf('shows') > -1) {
        show_rating();
    }
}

setInterval(run_script, 500);
function season_rating() {
    if(!$('.fa-heart-o').is(":visible")){
        return;
    }
    var number_of_episodes = $('.fanart > .corner-rating > .text').length,
        episode_ratings = 0;
    $('.fanart > .corner-rating > .text').each(function(key, value) {
        episode_ratings += parseInt($(value).text());
    });
    var seasonal_rating = episode_ratings / number_of_episodes;
    $('.summary-user-rating .number > .votes').text('Average season rating: ' + seasonal_rating.toFixed(2));
}

function show_rating() {
    var number_of_episodes = $('.season-posters .corner-rating > .text').length,
        episode_ratings = 0;
    $('.season-posters .corner-rating > .text').each(function(key, value) {
        episode_ratings += parseInt($(value).text());
    });
    var seasonal_rating = episode_ratings / number_of_episodes;
    $('.summary-user-rating .number > .votes').text('Average show rating: ' + seasonal_rating.toFixed(2));
}