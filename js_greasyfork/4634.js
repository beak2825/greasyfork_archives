// ==UserScript==
// @name        Letterboxd Average Rating
// @namespace   https://github.com/rcalderong/userscripts
// @description Adds average rating of film to film pages
// @copyright   2014+, Ramón Calderón (http://rcalderon.es)
// @homepageURL https://github.com/rcalderong/userscripts
// @supportURL  https://github.com/rcalderong/userscripts/issues
// @icon        https://raw.githubusercontent.com/rcalderong/userscripts/master/img/letterboxd_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.3
// @include     http://letterboxd.com/film/*
// @include     http://letterboxd.com/film/*/crew/*
// @include     http://letterboxd.com/film/*/studios/*
// @include     http://letterboxd.com/film/*/genres/*
// @exclude     http://letterboxd.com/film/*/views/*
// @exclude     http://letterboxd.com/film/*/lists/*
// @exclude     http://letterboxd.com/film/*/likes/*
// @exclude     http://letterboxd.com/film/*/fans/*
// @exclude     http://letterboxd.com/film/*/ratings/*
// @exclude     http://letterboxd.com/film/*/reviews/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4634/Letterboxd%20Average%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/4634/Letterboxd%20Average%20Rating.meta.js
// ==/UserScript==

var sectionElt = document.getElementsByClassName("ratings-histogram-chart")[0],
    ratingsPageUrl = sectionElt.getElementsByTagName("a")[0].href,
    dataElt = sectionElt.querySelector("span.average-rating meta"),
    oneToTenRating = parseFloat(dataElt.getAttribute("content")),
    oneToFiveRating = (oneToTenRating / 2).toFixed(1),
    ratingElt = document.createElement("a"),
    ratingInnerElt = document.createElement("span");

// Create element to be inserted in page
ratingElt.className = "rating-green tooltip";
ratingElt.style.position = "absolute";
ratingElt.style.top = "0";
ratingElt.style.left = "72px";
ratingElt.href = ratingsPageUrl;
ratingElt.setAttribute("title", oneToFiveRating + " stars" +
    " (" + oneToTenRating + "/10)");
ratingInnerElt.className = "rating rated-" + Math.round(oneToTenRating);
ratingElt.appendChild(ratingInnerElt);

// Insert element in page
sectionElt.insertBefore(ratingElt, sectionElt.children[1]);