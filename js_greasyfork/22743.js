// ==UserScript==
// @name        xkcd: Add explainxkcd.com links to comics
// @namespace   http://tampermonkey.net/
// @author      FPX
// @description This script adds the relevant explainxkcd.com link to xkcd comics.
// @include     http://xkcd.com/*
// @include     http://www.xkcd.com/*
// @include     https://xkcd.com/*
// @include     https://www.xkcd.com/*
// @version     1.0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22743/xkcd%3A%20Add%20explainxkcdcom%20links%20to%20comics.user.js
// @updateURL https://update.greasyfork.org/scripts/22743/xkcd%3A%20Add%20explainxkcdcom%20links%20to%20comics.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var currentURL = document.location.href;
    var explainURL = currentURL.replace("xkcd", "explainxkcd");
    var navigationBars = document.getElementsByClassName("comicNav");
    for (var i=0; i<navigationBars.length; i++) {
        var navigation = navigationBars[i];
        var nextLink = navigation.children[3];
        var explainLine = document.createElement("li");
        navigation.insertBefore(explainLine, nextLink);
        var explainLink = document.createElement("a");
        explainLink.href = explainURL;
        explainLink.innerHTML = "Explain";
        explainLine.appendChild(explainLink);
    }
    /* var comic = document.getElementById("comic").children[0];
    var altText = comic.getAttribute("title");
    var altTextSpan = document.createElement("span");
    altTextSpan.innerHTML = altText;
    var middleContainer = document.getElementById("middleContainer");
    middleContainer.insertBefore(altTextSpan, middleContainer.children[4]); */
})();
