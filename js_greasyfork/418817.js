// ==UserScript==
// @name  Plex- Add IMDB Link
// @description Add an IMDB Link to Plex
// @match http://virgulestar.noip.me:32400/*
// @grant GM_xmlhttpRequest
// @version 0.0.2.20220211
// @namespace https://greasyfork.org/users/718390
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/418817/Plex-%20Add%20IMDB%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/418817/Plex-%20Add%20IMDB%20Link.meta.js
// ==/UserScript==

'use strict';

//since plex is a spa (single page app), we have to perpetually monitor the page elements that get rendered, we can't count on a traditional full browser page refresh
var timerHandle = setInterval(main, 1000);

function main() {

    //"metadata" string in url means we're on an actual movie page in plex, otherwise just keep looping on timer
    if (window.location.href.indexOf("metadata") === -1) return;

    //also keep looping till we see the title element get rendered
    var titleElement = document.querySelector("div[data-testid='preplay-mainTitle']");
    if (!titleElement) return;
    var title = titleElement.textContent;
    var year = document.querySelector("div[data-testid='preplay-secondTitle']").textContent;

    //now that we've found a title we can do our bizness...
    //but only if we haven't already =)
    if (document.getElementById("imdbLink")) {
        clearInterval(timerHandle);
        return;
    }

    var imdbLinkQueryUrl = "https://v2.sg.media-imdb.com/suggestion/" + title[0].toLowerCase() + "/" + encodeURI(title + " (" + year +")") + ".json";
    console.log("imdb query:" + imdbLinkQueryUrl);

    //stack-o showed this oddball imdb "api" we can use to look up the magic imdb "id" for a movie
    //https://stackoverflow.com/questions/1966503/does-imdb-provide-an-api/7744369#7744369
    GM_xmlhttpRequest({
        method: "GET",
        url: imdbLinkQueryUrl,
        onload: function (response) {

            //wrapper existing imdb rating with a link to the imdb url for the movie
            var imdbLink = document.createElement("a");
            imdbLink.id = "imdbLink";
            var imdbRatingElement = document.querySelector("div[title^='IMDb Rating']");
            imdbRatingElement.parentNode.insertBefore(imdbLink, imdbRatingElement);
            imdbLink.appendChild(imdbRatingElement);

            if (response.responseText.indexOf("Bad query") > -1) {
                imdbLink.appendChild("not found on imdb");
            }
            else {
                var getId = /\"id\":\"(.*?)\"/;
                var match = response.responseText.match(getId); //match[1] will contain the id for the win!

                //finally we get to jam in our href to the corresponding imdb movie deets page!
                //nugget: cool part here is we can target the anchor id for the user reviews!! if that's not your main interest, just remove
                imdbLink.href = "https://www.imdb.com/title/" + match[1] + "/#titleUserReviewsTeaser";
                imdbLink.target = "_blank";
            };
        }
    });
}