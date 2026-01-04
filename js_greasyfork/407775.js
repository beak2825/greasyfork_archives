// ==UserScript==
// @name         Metacritic score in IMDB reference view
// @namespace    https://greasyfork.org/en/users/8813-nascent
// @version      0.4
// @description  Add Metacritic score in IMDB reference view
// @author       nascent
// @include      https://*.imdb.com/title/tt*/reference
// @grant        GM_xmlhttpRequest
// @connect      imdb.com
// @downloadURL https://update.greasyfork.org/scripts/407775/Metacritic%20score%20in%20IMDB%20reference%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/407775/Metacritic%20score%20in%20IMDB%20reference%20view.meta.js
// ==/UserScript==

function getMetaCriticDiv(title){
    var imdbTitleHTML;
    var link = "https://www.imdb.com/title/"+title;
    GM_xmlhttpRequest({
        method: "GET",
        url: link,
           anonymous: true, // remove original cookies
        synchronous: true,
        headers: {
            'Host': 'https://www.imdb.com',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36',
            'DNT': '1',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Accept-Language': "en-US,en;q=0.8,en-GB;q=0.6"
        },onload: function(response) {
            const fakeEl = document.createElement('div');
            //console.log("url: " + link);
            //console.log(response.responseText);
            fakeEl.innerHTML = response.responseText;
            console.log(fakeEl.innerHTML);
            var titleReviewBar;
            titleReviewBar = fakeEl.getElementsByClassName('titleReviewBar')[0];

            //cos(titleReviewBar.innerHTML);

            if (titleReviewBar) {
                console.debug("titleReviewBar occurences: " + titleReviewBar.length);
                //var regexp = /span>(.+?)</;
                //var regexp = /span>(.+?)</;
                var regexp = /href="(.+?)"[\s\S]+?<span>(.+?)<[\s\S]+?divider[\s\S]+?<div>[\s\S]+?reviews[\s\S]+?>(.+?)<[\s\S]+?>[\s\S]+?externalreviews[\s\S]+?>(.+?)<[\s\S]+?>/;
                var match = regexp.exec(titleReviewBar.innerHTML);
                var metaUrl;
                var metaRating;
                var userRating;
                var criticRating;
                if (match) {
                    metaUrl = match[1];
                    metaRating = match[2];
                    userRating = match[3]
                    criticRating = match[4]
                }

                if (metaRating) { //titleReviewBar
                    const ulEl = document.createElement('ul');
                    const liEl = document.createElement('li');
                    ulEl.classList.add("ipl-inline-list");
                    ulEl.classList.add("ipl-inline-list__item");
                    var ratingStar = document.getElementsByClassName("ipl-rating-widget");
                    if (ratingStar) {
                        ulEl.appendChild(liEl);
                        //liEl.appendChild(titleReviewBar); //titleReviewBar
                        if (metaUrl) {
                            liEl.innerHTML = "<a href=\"" + metaUrl + "\">MetaCritic</a>: ";
                        }

                        if (metaRating > 60) {
                            //liEl.innerHTML = "MetaCritic: <span style=\"background-color:#59bf26\"><font color=\"#ffffff\"><a href=\"criticreviews?ref_=tt_ov_rt\" rel=\"noreferrer1\">"+ metaRating + "</a></font></span>";
                            liEl.innerHTML += "<span style=\"background-color:#59bf26\"><font color=\"#ffffff\">" + metaRating + "</font></span>";
                        }
                        else if (metaRating > 40) {
                            liEl.innerHTML += "<span style=\"background-color:#d9af27\"><font color=\"#ffffff\">"+ metaRating + "</font></span>";
                        }
                        else {
                            liEl.innerHTML += "<span style=\"background-color:#cc2c10\"><font color=\"#ffffff\">"+ metaRating + "</font></span>";
                        }

                        if (criticRating) {
                            liEl.innerHTML += " (" + criticRating + "/" + userRating + ")";
                        }
                        ratingStar[0].parentNode.parentNode.parentNode.appendChild(ulEl);
                    }
                }
                else {
                    console.error("MetaCriticScore: no titleReview element returned");
                }
            }
            else {
                console.error("Unable to find titleReviewBar. title likely doesn't have a metactitic rating.");
            }
        }
    });
    return;

}


(function() {
    'use strict';
    var url = location.href;
    var regexp = /title\/(.+?)\//g;
    var match = regexp.exec(url);
    var titleReview;
    if (match) {
        getMetaCriticDiv(match[1]);
    }
})();