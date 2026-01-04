// ==UserScript==
// @name         Discogs/Ratings/Rearrange[PRIVATE]
// @namespace    https://greasyfork.org/en/scripts/387892
// @version      0.5
// @description  remove formatting and rearrange ratings page for display on release page
// @author       denlekke
// @match        http*://www.discogs.com/release/stats/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387892/DiscogsRatingsRearrange%5BPRIVATE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/387892/DiscogsRatingsRearrange%5BPRIVATE%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fiveStarsHTML = '<span class="rating rating_read_only" data-min="0" data-max="5" data-read-only="true" data-resettable="false" data-value="5" tabindex="0" aria-label="This release is rated 5 stars">            <span class="rating_icons"><span class="rating_range fill5"><a class="star star1 icon icon-star-o" undefined="" data-value="1"></a><a class="star star1 icon icon-star" undefined="" data-value="1"></a><a class="star star2 icon icon-star-o" undefined="" data-value="2"></a><a class="star star2 icon icon-star" undefined="" data-value="2"></a><a class="star star3 icon icon-star-o" undefined="" data-value="3"></a><a class="star star3 icon icon-star" undefined="" data-value="3"></a><a class="star star4 icon icon-star-o" undefined="" data-value="4"></a><a class="star star4 icon icon-star" undefined="" data-value="4"></a><a class="star star5 icon icon-star-o" undefined="" data-value="5"></a><a class="star star5 icon icon-star" undefined="" data-value="5"></a></span></span></span>';
    var fourStarsHTML = '<span class="rating rating_read_only" data-min="0" data-max="5" data-read-only="true" data-resettable="false" data-value="4" tabindex="0" aria-label="This release is rated 4 stars">            <span class="rating_icons"><span class="rating_range fill4"><a class="star star1 icon icon-star-o" undefined="" data-value="1"></a><a class="star star1 icon icon-star" undefined="" data-value="1"></a><a class="star star2 icon icon-star-o" undefined="" data-value="2"></a><a class="star star2 icon icon-star" undefined="" data-value="2"></a><a class="star star3 icon icon-star-o" undefined="" data-value="3"></a><a class="star star3 icon icon-star" undefined="" data-value="3"></a><a class="star star4 icon icon-star-o" undefined="" data-value="4"></a><a class="star star4 icon icon-star" undefined="" data-value="4"></a><a class="star star5 icon icon-star-o" undefined="" data-value="5"></a><a class="star star5 icon icon-star" undefined="" data-value="5"></a></span></span></span>';
    var threeStarsHTML = '<span class="rating rating_read_only" data-min="0" data-max="5" data-read-only="true" data-resettable="false" data-value="3" tabindex="0" aria-label="This release is rated 3 stars">            <span class="rating_icons"><span class="rating_range fill3"><a class="star star1 icon icon-star-o" undefined="" data-value="1"></a><a class="star star1 icon icon-star" undefined="" data-value="1"></a><a class="star star2 icon icon-star-o" undefined="" data-value="2"></a><a class="star star2 icon icon-star" undefined="" data-value="2"></a><a class="star star3 icon icon-star-o" undefined="" data-value="3"></a><a class="star star3 icon icon-star" undefined="" data-value="3"></a><a class="star star4 icon icon-star-o" undefined="" data-value="4"></a><a class="star star4 icon icon-star" undefined="" data-value="4"></a><a class="star star5 icon icon-star-o" undefined="" data-value="5"></a><a class="star star5 icon icon-star" undefined="" data-value="5"></a></span></span></span>';
    var twoStarsHTML = '<span class="rating rating_read_only" data-min="0" data-max="5" data-read-only="true" data-resettable="false" data-value="2" tabindex="0" aria-label="This release is rated 2 stars">            <span class="rating_icons"><span class="rating_range fill2"><a class="star star1 icon icon-star-o" undefined="" data-value="1"></a><a class="star star1 icon icon-star" undefined="" data-value="1"></a><a class="star star2 icon icon-star-o" undefined="" data-value="2"></a><a class="star star2 icon icon-star" undefined="" data-value="2"></a><a class="star star3 icon icon-star-o" undefined="" data-value="3"></a><a class="star star3 icon icon-star" undefined="" data-value="3"></a><a class="star star4 icon icon-star-o" undefined="" data-value="4"></a><a class="star star4 icon icon-star" undefined="" data-value="4"></a><a class="star star5 icon icon-star-o" undefined="" data-value="5"></a><a class="star star5 icon icon-star" undefined="" data-value="5"></a></span></span></span>';
    var oneStarsHTML = '<span class="rating rating_read_only" data-min="0" data-max="5" data-read-only="true" data-resettable="false" data-value="1" tabindex="0" aria-label="This release is rated 1 stars">            <span class="rating_icons"><span class="rating_range fill5"><a class="star star1 icon icon-star-o" undefined="" data-value="1"></a><a class="star star1 icon icon-star" undefined="" data-value="1"></a></span></span></span>';

    var releaseId = window.location.href.split("/stats/")[1];
    var statsGroups = document.querySelectorAll(".release_stats_group");

    if (statsGroups != null){
        var htmlOutput = '';
        var htmlRatings = '';
        var htmlHaves = '';
        var htmlWants = '';

        for (var j =0; j < statsGroups.length; j++){
            var content = ''
            var groupInnerText = statsGroups[j].innerText;
            var groupInnerHTML = statsGroups[j].innerHTML;

            if(groupInnerText.includes('have this')){
                content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                htmlHaves += '<h3>HAVE</h3>';
                htmlHaves += content;
            }
            else if(groupInnerText.includes('want this')){
                content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                htmlWants += '<h3>WANT</h3>';
                htmlWants += content;
            }
            else if(groupInnerText.includes('Ratings')){
                content = statsGroups[j].querySelectorAll(".release_stats_group_list")[0];

                var fiveRaters = [];
                var fourRaters = [];
                var threeRaters = [];
                var twoRaters = [];
                var oneRaters = [];

                var ratingsList = content.querySelectorAll("li");

                for(var q=0; q < ratingsList.length; q++){
                    var rating;
                    if(ratingsList[q].childNodes[3]){
                        rating = ratingsList[q].childNodes[3].getAttribute('data-value');
                    }
                    else{
                        rating = 0;
                    }
                    //console.log(rating);
                    if(rating === '1'){
                        oneRaters.push(ratingsList[q]);
                    }
                    else if(rating === '2'){
                        twoRaters.push(ratingsList[q]);
                    }
                    else if(rating === '3'){
                        threeRaters.push(ratingsList[q]);
                    }
                    else if(rating === '4'){
                        fourRaters.push(ratingsList[q]);
                    }
                    else if(rating === '5'){
                        fiveRaters.push(ratingsList[q]);
                    }
                }
                content = ''
                for (var ratinghtml of fiveRaters){
                    var temp = ratinghtml.innerHTML;
                    content += ratinghtml.outerHTML;
                }
                for (ratinghtml of fourRaters){
                    temp = ratinghtml.innerHTML;
                    content += ratinghtml.outerHTML;
                }
                for (ratinghtml of threeRaters){
                    temp = ratinghtml.innerHTML;
                    content += ratinghtml.outerHTML;
                }
                for (ratinghtml of twoRaters){
                    temp = ratinghtml.innerHTML;
                    content += ratinghtml.outerHTML;
                }
                for (ratinghtml of oneRaters){
                    temp = ratinghtml.innerHTML;
                    content += ratinghtml.outerHTML;
                }

                htmlRatings += '<h3>RATINGS</h3>';
                htmlRatings += "<ul>"+content+"</ul>";
            }
        }

        var main = document.body;
        htmlOutput = htmlRatings+htmlHaves+htmlWants;
        main.innerHTML = htmlOutput;
        main.style.minWidth = 'unset';
     }

})();


