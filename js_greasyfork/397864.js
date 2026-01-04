// ==UserScript==
// @name         Discogs/Ratings/Rearrange
// @namespace    https://greasyfork.org/en/scripts/397864
// @version      0.4
// @description  remove formatting and rearrange ratings page for display on release page
// @author       denlekke
// @match        http*://www.discogs.com/release/stats/*
// @match        http*://www.discogs.com/master/stats/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397864/DiscogsRatingsRearrange.user.js
// @updateURL https://update.greasyfork.org/scripts/397864/DiscogsRatingsRearrange.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

            if(groupInnerText.includes(' have this')){
                content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                htmlHaves += '<h3>HAVE</h3>';
                htmlHaves += content;
            }
            else if(groupInnerText.includes(' want this')){
                content = statsGroups[j].querySelectorAll("ul")[0].outerHTML;
                htmlWants += '<h3>WANT</h3>';
                htmlWants += content;
            }
            else if(groupInnerText.includes(' Rating')){
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

                htmlRatings += '<h3>RATING</h3>';
                htmlRatings += "<ul>"+content+"</ul>";
            }
        }

        if (htmlWants === ''){
            htmlWants = '<h3>WANT</h3><ul>No information available</ul>';
        }
        if (htmlHaves === ''){
            htmlHaves = '<h3>HAVE</h3><ul>No information available</ul>';
        }
        if (htmlRatings === ''){
            htmlRatings = '<h3>RATING</h3><ul>No information available</ul>';
        }
        var main = document.body;
        htmlOutput = htmlRatings+htmlHaves+htmlWants;
        main.innerHTML = htmlOutput;
        main.style.minWidth = 'unset';

     }

})();


