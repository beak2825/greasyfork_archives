// ==UserScript==
// @name         xkcd++
// @version      0.1
// @description  Adds an explainxkcd button, and puts the title text below the image.
// @include      /^https?:\/\/(www\.)?xkcd\.com\/(\d+\/)?/
// @grant        none
// @namespace https://greasyfork.org/users/161413
// @downloadURL https://update.greasyfork.org/scripts/40321/xkcd%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/40321/xkcd%2B%2B.meta.js
// ==/UserScript==

// Update URL: chrome-extension://dhdgffkkebhmkfjojejmpbldmpobfkfo/options.html#nav=93fbdeb3-8482-4c95-80ff-17ad787c6757+editor

// Get the explain xkcd link and the current xkcd id.
var matches         = /xkcd\.com\/(?:(\d+)\/)?/i.exec(window.location.href);
var explainXkcdLink = 'http://www.explainxkcd.com/wiki/index.php/';
var currXkcdId      = null;
if (typeof matches[1] !== 'undefined') {
    // Is not the homepage (xkcd.com).
    explainXkcdLink += matches[1];
    currXkcdId = matches[1];
} else {
    currXkcdId = /https:\/\/xkcd\.com\/(\d+)\//.exec(document.getElementById('middleContainer').innerText)[1]; // Get the current xkcd id from the permanent link.
}

// Add the "?" buttons.
var allComicNavs = document.getElementsByClassName('comicNav');
for (var i = 0; i < allComicNavs.length; i++) {
    var comicNav = allComicNavs[i];
    comicNav.innerHTML += '<li><a href="' + explainXkcdLink + '" target="_blank">?</a></li>';
}

// Add the title text.
var titleText         = document.querySelector('#comic img').title;
var comicEl           = document.getElementById('comic');
comicEl.style.display = 'table';
comicEl.style.width   = '1px';
comicEl.style.margin  = '0 auto';
comicEl.innerHTML += "<br>";
comicEl.innerHTML += "<br>";
document.head.innerHTML += "<link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\">"; // Load the Roboto font.
comicEl.innerHTML += "Title: <span style='font-family: \"Roboto\", sans-serif; font-variant-caps: normal; font-size: 14px;'>" + titleText + "</span>";
comicEl.innerHTML += "<br>";
comicEl.innerHTML += "<br>";


// Set isPageFromRandom to true in local storage so we can detect that it's a page from random on the next page load.
var allRandomButtons = document.querySelectorAll('.comicNav > li:nth-child(3) > a');
for (var i = 0; i < allRandomButtons.length; i++) {
    var randomButton     = allRandomButtons[i];
    randomButton.onclick = function () {
        localStorage.setItem('isPageFromRandom', true);
    };
}

var isPageFromRandom = (localStorage.getItem('isPageFromRandom') == 'true');
console.log("isPageFromRandom: ", isPageFromRandom);

// Get visitedXkcdIds.
var visitedXkcdIds = localStorage.getItem('visitedXkcdIds'); // Get previously visited xkcds.
if (visitedXkcdIds == null) {
    visitedXkcdIds = [];
} else {
    visitedXkcdIds = visitedXkcdIds.split(',');
}
console.log("visitedXkcdIds: ", visitedXkcdIds);

// If it's from random, and we've already seen this comic before, ask if they want to reload.
if (isPageFromRandom) {
    if (visitedXkcdIds.indexOf(currXkcdId) != -1) {
        console.log("Have seen before");
        setTimeout(function () {
            if (confirm("It appears that you've already seen this comic. Go to a random one?")) {
                window.location.href = 'https://c.xkcd.com/random/comic/';
            } else {
                localStorage.setItem('isPageFromRandom', false);
            }
        }, 50);
    } else {
        localStorage.setItem('isPageFromRandom', false);
    }
}

// Add the current xkcd to the list of visited xkcd ids.
if (visitedXkcdIds.indexOf(currXkcdId) == -1) {
    visitedXkcdIds.push(currXkcdId);
    console.log("Adding " + currXkcdId + " to visitedXkcdIds");
    localStorage.setItem('visitedXkcdIds', visitedXkcdIds.join(','));
}

document.onkeyup = function (event) {
    event = event || window.event;
    if (!event.ctrlKey && !event.altKey && !event.shiftKey) {
        if (event.which == 37) { // Left key.
            window.location.href = $('a[rel=prev]').attr('href');
            return false;
        } else if (event.which == 39) { // Right key.
            window.location.href = $('a[rel=next]').attr('href');
            return false;
        } else if (event.which == 82) { // R keys.
            window.location.href = '//c.xkcd.com/random/comic/';
            return false;
        }
    }
};
