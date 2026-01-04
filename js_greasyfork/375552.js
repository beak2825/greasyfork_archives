// ==UserScript==
// @name         IMDB Top 1000 Voters Rating
// @namespace    https://github.com/nullannos
// @version      0.1
// @description  replaces regular rating with top 1000 voters instead
// @author       nullannos
// @match        https://www.imdb.com/title/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375552/IMDB%20Top%201000%20Voters%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/375552/IMDB%20Top%201000%20Voters%20Rating.meta.js
// ==/UserScript==

var pageId = $('meta[property=pageId]').attr("content");

(function() {
    'use strict';

        GM_xmlhttpRequest({
        method: "GET",
        url: "https://www.imdb.com/title/" + pageId + "/ratings",
        onload: function(response) {

            var doc = new DOMParser().parseFromString(response.responseText, 'text/html');
            var docr = doc.getElementsByClassName("bigcell")[15];
            var docrt = docr.innerText;
            var ratingTip = $('.ratingValue').find("strong").attr("title", docrt + " based on top 1000 voters");
            var rating = $('.ratingValue').find('[itemprop="ratingValue"]').text(docrt)

        }
    });
})();