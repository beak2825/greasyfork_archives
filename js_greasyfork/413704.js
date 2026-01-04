// ==UserScript==
// @name        Imdb Show rating by season
// @namespace   vozf
// @author      vozf
// @description Shows season statistics for TV Shows on IMDB
// @include     https://www.imdb.com/title/*
// @include     https://www.imdb.com/title/*/episodes*
// @version     0.2
// @grant       none
// @license Creative Commons Attribution-NonCommercial 3.0 http://creativecommons.org/licenses/by-nc/3.0/
//
// This script uses the following external libraries which are available under different licenses:
// jQuery (https://jquery.com/) is provided under the MIT License https://tldrlegal.com/license/mit-license

// @require https://code.jquery.com/jquery-2.1.4.min.js
//
// @downloadURL https://update.greasyfork.org/scripts/413704/Imdb%20Show%20rating%20by%20season.user.js
// @updateURL https://update.greasyfork.org/scripts/413704/Imdb%20Show%20rating%20by%20season.meta.js
// ==/UserScript==

// compatibility
this.$ = this.jQuery = jQuery.noConflict(true);


function addRanksToEpRatePage() {
    tabRowsVar = $('.ipl-rating-star.small > .ipl-rating-star__rating');
    average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
    ratings = tabRowsVar.map(function() {
        return parseFloat($(this).text());
    }).get()

    rating = average(ratings)

    $('#episode_top').append(` (Rating - ${rating.toFixed(2)})`);
}


function addLinkToTVShowPage(linkDest) {
    episodesHeadline = $('#main_bottom .article h2');
    if ((episodesHeadline != undefined) && (episodesHeadline.eq(0).text() == 'Episodes')) {
        // this is a TV show
        ratingBox=$('#overview-top .star-box-details');
        if (ratingBox.length == 0) {
            ratingBox=$('.ratings_wrapper');
        }
        ratingBox.eq(0).append('<br/><a href=\''.concat(linkDest).concat('eprate\'>Show Episode Ranking</a>'));
    }
}
function start(){
    currURL = document.URL.split('?') [0];
    if (currURL.match(/episodes/g) != undefined) {
        // we are on an eprate page
        addRanksToEpRatePage();

        var target = document.querySelector('#episodes_content')
        // create an observer instance
        var observer = new MutationObserver(addRanksToEpRatePage);
        // configuration of the observer:
        var config = { attributes: true, childList: true, characterData: true };
        // pass in the target node, as well as the observer options
        observer.observe(target, config);
    } else {
        addLinkToTVShowPage(currURL);
    }
}

window.addEventListener('load', start)



