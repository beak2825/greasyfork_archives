// ==UserScript==
// @name         PTP button on other film sites
// @version      1.1.4
// @namespace    https://github.com/chrisjp
// @description  Adds a button linking to a PTP search for the film on websites including IMDb, TMDB, Letterboxd, and Trakt.
// @license      MIT
// @icon         https://passthepopcorn.me/static/common/touch-icon-iphone-retina.png
// @homepageURL  https://github.com/chrisjp/ptpBtnOnFilmSites
// @supportURL   https://github.com/chrisjp/ptpBtnOnFilmSites/issues
// @match        https://*.imdb.com/title/tt*
// @match        https://letterboxd.com/film/*
// @match        https://trakt.tv/movies/*
// @match        https://www.themoviedb.org/movie/*
// @exclude      https://letterboxd.com/film/*/views/*
// @exclude      https://letterboxd.com/film/*/lists/*
// @exclude      https://letterboxd.com/film/*/likes/*
// @exclude      https://letterboxd.com/film/*/fans/*
// @exclude      https://letterboxd.com/film/*/ratings/*
// @exclude      https://letterboxd.com/film/*/reviews/*
// @grant        GM.addStyle
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/452640/PTP%20button%20on%20other%20film%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/452640/PTP%20button%20on%20other%20film%20sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Which website are we on?
    let domain = window.location.hostname.replace('www.', '');
    let imdbId = null;
    //console.log(`Domain: ${domain}`);

    if (domain === "imdb.com" || domain === "m.imdb.com") {
        addPtpToImdb();
    }
    else if (domain === "letterboxd.com") {
        addPtpToLetterboxd();
    }
    else if (domain === "trakt.tv") {
        addPtpToTrakt();
    }
    else if (domain === "themoviedb.org") {
        addPtpToTmdb();
    }
})();

// IMDb: Add a button linking to PTP in the ratings bar
function addPtpToImdb()
{
    // Perform some checks...
    // 1. that this film has a rating (i.e. it's been released)
    // 2. User rating button. This is useful in rare cases where a film is too obscure or new to have
    //    enough ratings (>=5) for IMDb to display an average
    let filmHasAggRating = document.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"]');
    let filmHasYourRating = document.querySelector('[data-testid="hero-rating-bar__user-rating"]');

    // Get IMDb ID from the URL
    let imdbId = document.URL.match(/\/tt([0-9]+)\/?/)[1];
    if (imdbId > 0 && (filmHasAggRating !== null || filmHasYourRating !== null)) {
        // Since a lot of relevant class names are random... Basically we:
        // 1. get the div.rating-bar__base-button elements
        // 2. clone the first one (IMDb average user rating)
        // 3. set its HTML to the information we just scraped from Letterboxd
        // 4. add it to the DOM with the other div.rating-bar__base-button elements
        // That way it keeps all IMDB's styling and looks like a normal part of the page

        const ptpUrl = "https://passthepopcorn.me/torrents.php?action=advanced&searchstr=tt" + imdbId + "&order_by=relevance";

        // Clone the node
        let ratingBarBtns = document.querySelectorAll(".rating-bar__base-button");
        let ratingBarBtnPTP = ratingBarBtns[0].cloneNode(true);

        // Add CSS (this forces it to the leftmost position in the ratings bar)
        ratingBarBtnPTP.classList.add('ptp-button');
        GM.addStyle(`
        .ptp-button { order: -1; }
        `);

        // Set title
        ratingBarBtnPTP.children[0].innerHTML = "PTP";

        // If the cloned node is the IMDb aggregate rating we can simply overwrite the child elements' innerHTML
        if (ratingBarBtnPTP.dataset.testid === "hero-rating-bar__aggregate-rating") {
            console.log("ptpBtnOnFilmSites: We have a valid IMDb rating. Adding PTP button to DOM...");

            // set a.href
            let ptpElementA = ratingBarBtnPTP.children[1];
            ptpElementA.href = ptpUrl;

            // edit all its child elements
            let ptpElementADiv = ptpElementA.children[0].children[0];
            // icon set to 24x24
            ptpElementADiv.children[0].innerHTML = '<img src="https://passthepopcorn.me/static/common/touch-icon-iphone-retina.png" alt="" width="24" height="24">';
            // ratings data
            let ptpElementDiv = ptpElementADiv.children[1];
            // average rating
            ptpElementDiv.children[0].children[0].innerHTML = "\uD83D\uDD0E"; // magnifying glass emoji
            ptpElementDiv.children[0].children[1].remove();
            // total ratings
            ptpElementDiv.children[2].remove();
            // data-testid
            ptpElementDiv.children[0].dataset.testid = "hero-rating-bar__ptp-button";
        }
        // If the cloned node is NOT the IMDb aggregate rating (it doesn't have one) it'll be the button allowing us to rate it if logged in
        // The child nodes of the <button> are very similar so we can still modify the HTML in a similar way
        else if (ratingBarBtnPTP.dataset.testid === "hero-rating-bar__user-rating") {
            console.log("ptpBtnOnFilmSites: We don't have a valid IMDb rating. Adding PTP button to DOM...");
            let btnNode = ratingBarBtnPTP.children[1];
            let btnChildNode = ratingBarBtnPTP.children[1].children[0];

            // create <a> element
            let ptpElementA = document.createElement("a");
            ptpElementA.className = btnNode.classList.toString();
            ptpElementA.href = ptpUrl;
            // clone the <button>'s child node (should be a span) and append it to our <a>
            ptpElementA.append(btnChildNode.cloneNode(true));

            // edit all its child elements
            let ptpElementADiv = ptpElementA.children[0].children[0];
            // icon set to 24x24
            ptpElementADiv.children[0].innerHTML = '<img src="https://passthepopcorn.me/static/common/touch-icon-iphone-retina.png" alt="" width="24" height="24">';
            // ratings data container
            let ptpElementDiv = ptpElementADiv.children[1];
            // average rating
            ptpElementDiv.children[0].innerHTML = "\uD83D\uDD0E";

            // replace the <button> with the <a> we created and modified above
            btnNode.replaceWith(ptpElementA);
        }

        // Add the finished element to the DOM
        ratingBarBtnPTP.dataset.testid = "hero-rating-bar__ptp-button";
        ratingBarBtns[0].parentNode.appendChild(ratingBarBtnPTP);
    }
    else {
        console.log("ptpBtnOnFilmSites: No rating bar found. Film has probably not yet been released, or we're on a subpage of this film.");
    }

}

// Letterboxd: Add a button linking to PTP next to the IMDb and TMDB buttons
function addPtpToLetterboxd()
{
    // Initialize variables
    let imdbId = null;
    let searchStr = null;

    // Find the .micro-button linking to the film's IMDb page so we can scrape the ID.
    let imdbButton = document.querySelector('[data-track-action="IMDb"]');
    if (imdbButton) {
        imdbId = imdbButton.href.match('http://www.imdb.com/title/\(.*\)/maindetails')[1];
    }
    else {
        console.log("ptpBtnOnFilmSites: Unable to retrieve IMDb ID. Falling back to using the film's title.");
    }
    // Get the film title too so we can fall back to it
    let filmTitle = document.querySelector('h1.headline-1.primaryname');
    filmTitle = filmTitle ? filmTitle.innerText : null;
    let filmYear = document.querySelector('div.releaseyear');
    filmYear = filmYear ? filmYear.innerText : null;

    // Determine if we'll search PTP using the IMDb ID or the film title
    if (imdbId) {
        searchStr = imdbId;
    }
    else if (filmTitle) {
        searchStr = encodeURIComponent(filmTitle);
        if (filmYear > 1800) searchStr += '&year=' + filmYear;
    }
    else {
        console.log("ptpBtnOnFilmSites: Unable to retrieve IMDb ID or a film title to fallback to. Has the HTML or CSS class(es) changed?");
    }

    // If we have IMDb ID or title, create an anchor element linking to the PTP search page
    if (searchStr) {
        let linkPtp = document.createElement("a");
        linkPtp.innerHTML = "PTP";
        linkPtp.classList.add('micro-button');
        linkPtp.href = 'https://passthepopcorn.me/torrents.php?action=advanced&searchstr=' + searchStr + '&order_by=relevance';

        // Add the element after the existing .micro-button's
        let microButtons = document.querySelectorAll(".micro-button");
        if (microButtons) {
            console.log("ptpBtnOnFilmSites: Adding PTP button to DOM. IMDb ID (%s), filmTitle (%s), filmYear (%s)", imdbId, filmTitle, filmYear);
            microButtons[microButtons.length-1].after(linkPtp);
            microButtons[microButtons.length-1].after("\n");
        }
        else {
            console.log("ptpBtnOnFilmSites: Unable to add PTP button to DOM. Has the HTML or CSS class(es) changed?");
        }
    }
    else {
        console.log("ptpBtnOnFilmSites: Unable to add PTP button.");
    }
}

// Trakt: Add a button linking to PTP with the other External Links
function addPtpToTrakt()
{
    // If the IMDb ID is given we'll use that, otherwise we'll use film title
    let imdbId = null;
    // Find the button linking to the film's IMDb page so we can scrape the ID.
    let imdbButton = document.querySelector('#external-link-imdb');
    if (imdbButton) imdbId = imdbButton.href.match('imdb.com/title/\(.*\)')[1];

    // Get the film title too so we can fall back to it
    // There is potentially a year and a certificate rating here so we'll need to deal with those
    // by looping through the child nodes and ignoring anything in other elements.
    let titleContainer = document.querySelector('div.mobile-title h1');
    let filmYear = titleContainer.querySelector('.year').innerText;
    let filmTitle = null;

    let child = titleContainer.firstChild
    let values = [];
    while (child) {
        if (child.nodeType === 3) {
            filmTitle = child.data.trim();
            break;
        } else {
            child = child.nextSibling;
        }
    }

    // Encode the search string if no IMDb ID
    let searchStr = imdbId;
    if (searchStr === null) {
        searchStr = encodeURIComponent(filmTitle);
        if (filmYear > 1800) searchStr += '&year=' + filmYear;
    }

    // Create an anchor element linking to the PTP search page
    let linkPtp = document.createElement("a");
    linkPtp.innerHTML = "PTP";
    linkPtp.href = 'https://passthepopcorn.me/torrents.php?action=advanced&searchstr=' + searchStr + '&order_by=relevance';

    // Add the element to ul.external
    let extButtons = document.querySelector("ul.external li");
    extButtons.append(linkPtp);
}

// TheMovieDB: Add a button linking to PTP next to any social media links
function addPtpToTmdb()
{
    // Sadly a lot of metadata is hidden from public display, including the IMDb ID.
    // The best we can do is a title search but in most cases this will be good enough.
    let filmTitle = document.head.querySelector("meta[property='og:title']").content;

    // Encode the search string
    let searchStr = encodeURIComponent(filmTitle);

    // Year?
    let filmYear = document.querySelector('span.tag.release_date').innerText;
    if (filmYear) {
        filmYear = filmYear.slice(1, -1); // remove brackets
        searchStr += "&year=" + filmYear;
    }

    // Create an anchor element linking to the PTP search page
    let linkPtp = document.createElement("a");
    linkPtp.innerHTML = '<img src="https://passthepopcorn.me/static/common/touch-icon-iphone-retina.png" alt="PTP" class="glyphiconimg" />';
    linkPtp.classList.add('social_link');
    linkPtp.title = "Search PTP";
    linkPtp.href = 'https://passthepopcorn.me/torrents.php?action=advanced&searchstr=' + searchStr + '&order_by=relevance';
    linkPtp.target = "_blank";
    linkPtp.rel = "noopener";
    linkPtp.dataset.role = "tooltip";

    // Add CSS so the icon is correctly aligned
    GM.addStyle(`
    .glyphiconimg {
        position: relative;
        top: -4px;
        left: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding-top: 0 !important;
        width: 21px !important;
        height: 21px !important;
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
    }
    `);

    // Create div container and add the a tag
    let linkPtpDiv = document.createElement("div");
    linkPtpDiv.classList.add('homepage');
    linkPtpDiv.append(linkPtp);

    // Add the element in div.social_links
    let social_links = document.querySelector("div.social_links");
    social_links.append(linkPtpDiv);
}