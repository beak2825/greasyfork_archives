// ==UserScript==
// @name         Letterboxd ratings on IMDb
// @version      1.0.4
// @namespace    https://github.com/chrisjp
// @description  Shows a film's Letterboxd rating on its IMDb page.
// @license      MIT
// @homepageURL  https://github.com/chrisjp/LetterboxdOnIMDb
// @supportURL   https://github.com/chrisjp/LetterboxdOnIMDb/issues
// @match        https://*.imdb.com/title/tt*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.imdb.com
// @connect      letterboxd.com
// @grant        GM.xmlHttpRequest
// @grant        GM.addStyle
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/452708/Letterboxd%20ratings%20on%20IMDb.user.js
// @updateURL https://update.greasyfork.org/scripts/452708/Letterboxd%20ratings%20on%20IMDb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Perform some checks...
    // 1. that this film has a rating (i.e. it's been released)
    // 2. User rating button. This is useful in rare cases where a film is too obscure or new to have
    //    enough ratings (>=5) for IMDb to display an average
    // 3. Popularity meter. If neither of the above are found it's likely an upcoming film that has trailers
    //    or other pre-release media available such that it's getting attention.
    //    Obviously no rating can be displayed for such films, but we can at least link to the Letterboxd
    //    page (if it exists) for convenience.
    let filmHasAggRating = document.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"]');
    let filmHasYourRating = document.querySelector('[data-testid="hero-rating-bar__user-rating"]');
    let filmHasPopularity = document.querySelector('[data-testid="hero-rating-bar__popularity"]');

    // Get IMDb ID from the URL
    let imdbId = document.URL.match(/\/tt([0-9]+)\//)[1];
    if (imdbId > 0 && (filmHasAggRating !== null || filmHasYourRating !== null || filmHasPopularity !== null)) {
        //console.log("IMDb ID: " + imdbId);
        getLetterboxdRating(imdbId);
    }
    else {
        console.log("Letterboxd on IMDb user script: No rating bar found. Film has probably not yet been released, or we're on a subpage of this film.");
    }
})();

function getLetterboxdRating(imdbId)
{
    // Letterboxd can redirect to a film's page if provided the IMDb ID (minus 'tt' prefix).
    // Formatted as follows: https://letterboxd.com/imdb/0000000
    const letterboxd = "https://letterboxd.com";
    const url = letterboxd + "/imdb/" + imdbId + "/";
    GM.xmlHttpRequest({
        method:  "GET",
        timeout: 10000,
        url:     url,
        onload:  function(response) {
            if (response.finalUrl != url) {
                // We were redirected, so the film exists on Letterboxd. Now we can get its ID,
                // or in this case the URL slug identifying it. With that we can then generate
                // a URL to its rating histogram, which we can then parse to obtain ratings data.
                const letterboxdUrl = response.finalUrl;
                const letterboxdId = letterboxdUrl.split(letterboxd)[1];
                const letterboxdHistUrl = letterboxd + "/csi" + letterboxdId + "rating-histogram/";
                console.log("Letterboxd histogram URL for this film: " + letterboxdHistUrl);
                getLetterboxdHistogram(letterboxdUrl, letterboxdHistUrl);
            }
            else {
                // We did not get redirected to the film's URL on Letterboxd, meaning it hasn't been added to their database
                // or doesn't have an IMDb ID associated with it.
                console.log("Film not found on Letterboxd.");
            }
        },
        onerror: function() {
            console.log("Letterboxd on IMDb user script: Request Error in getLetterboxdRating.");
        },
        onabort: function() {
            console.log("Letterboxd on IMDb user script: Request is aborted in getLetterboxdRating");
        },
        ontimeout: function() {
            console.log("Letterboxd on IMDb user script: Request timed out in getLetterboxdRating.");
        }
    });
}

function getLetterboxdHistogram(letterboxdUrl, letterboxdHistUrl)
{
    // Scraping the rating histogram page is much more reliable than the film page
    // especially for films with very few ratings
    GM.xmlHttpRequest({
        method:  "GET",
        timeout: 10000,
        url:     letterboxdHistUrl,
        onload: function(response) {
            const parser = new DOMParser();
            const result = parser.parseFromString(response.responseText, "text/html");

            // Parse the scraped HTML if we have a .display-rating element.
            const letterboxdRatingA = result.getElementsByClassName("display-rating")[0];
            if (letterboxdRatingA) {
                const letterboxdRating = parseFloat(letterboxdRatingA.innerText);
                const letterboxdTotalRatingsText = letterboxdRatingA.title;
                const letterboxdTotalRatings = parseInt(letterboxdTotalRatingsText.match("based on \(.*\)ratings")[1].replaceAll(",",""));

                addLetterboxdRatingToIMDb(letterboxdUrl, letterboxdRating, letterboxdTotalRatings);
            }
            else {
                // If we reached this point it's almost certainly because the film does not yet have enough ratings for Letterboxd
                // to calculate the weighted average. Check for "not enough ratings" text to confirm, then manually calculate.
                let letterboxdTotalRatings = 0;
                const notEnoughRatings = result.querySelector('[title="Not enough ratings to calculate average"]');
                if (notEnoughRatings) {
                    // we can try to manually calculate the number of ratings
                    const regexCalc = /title="(\d)&nbsp/gm;
                    const matches = response.responseText.matchAll(regexCalc);
                    for (let match of matches) {
                        letterboxdTotalRatings += parseInt(match[1]);
                    }
                    console.log("Manually counted " + letterboxdTotalRatings + " ratings on Letterboxd for this film.");

                }
                else {
                    // If the "not enough ratings" text can't be found that means there's no ratings at all.
                    // This will usually mean it's a currently unreleased film. We can still try to show
                    // a link to the Letterboxd page without any rating data.
                    console.log("Film exists on Letterboxd but has no ratings data.");
                }
                letterboxdTotalRatings = letterboxdTotalRatings > 0 ? letterboxdTotalRatings : "-";
                addLetterboxdRatingToIMDb(letterboxdUrl, "-", letterboxdTotalRatings);
            }
        },
        onerror: function() {
            console.log("Letterboxd on IMDb user script: Request Error in getLetterboxdHistogram.");
        },
        onabort: function() {
            console.log("Letterboxd on IMDb user script: Request is aborted in getLetterboxdHistogram.");
        },
        ontimeout: function() {
            console.log("Letterboxd on IMDb user script: Request timed out in getLetterboxdHistogram.");
        }
    });
}

function addLetterboxdRatingToIMDb(letterboxdUrl, letterboxdRating, letterboxdTotalRatings)
{
    // Since a lot of relevant class names are random on each page load... Basically we:
    // 1. get the div.rating-bar__base-button elements
    // 2. clone the first one (IMDb average user rating)
    // 3. set its HTML to the information we just scraped from Letterboxd
    // 4. add it to the DOM with the other div.rating-bar__base-button elements
    // That way it keeps all IMDB's styling and looks like a normal part of the page

    // Clone the node
    let ratingBarBtns = document.querySelectorAll(".rating-bar__base-button");
    let ratingBarBtnLetterboxd = ratingBarBtns[0].cloneNode(true);

    // Add CSS (this forces it to the leftmost position in the ratings bar)
    // Also adds CSS for Letterboxd button on films without a rating yet.
    ratingBarBtnLetterboxd.classList.add('letterboxd-rating');
    GM.addStyle(`
    .letterboxd-rating { order: -1; }
    .letterboxd-rating-bottom {
         color: var(--ipt-on-baseAlt-textSecondary-color, rgba(255,255,255,0.7));
         font-family: var(--ipt-font-family);
         font-size: var(--ipt-type-bodySmall-size, .875rem);
         font-weight: var(--ipt-type-bodySmall-weight, 400);
         letter-spacing: var(--ipt-type-bodySmall-letterSpacing, .01786em);
         line-height: var(--ipt-type-bodySmall-lineHeight, 1.25rem);
         text-transform: var(--ipt-type-bodySmall-textTransform, none);
     }
     @media screen and (min-width: 1024px) {
         .letterboxd-rating-bottom {
             font-family: var(--ipt-font-family);
             font-size: var(--ipt-type-copyright-size, .75rem);
             font-weight: var(--ipt-type-copyright-weight, 400);
             letter-spacing: var(--ipt-type-copyright-letterSpacing, .03333em);
             line-height: var(--ipt-type-copyright-lineHeight, 1rem);
             text-transform: var(--ipt-type-copyright-textTransform, none);
        }
    }
    `);

    // Set title
    ratingBarBtnLetterboxd.children[0].innerHTML = "Letterboxd".toUpperCase();

    // If the cloned node is the IMDb aggregate rating we can simply overwrite the child elements' innerHTML
    // with data we've obtained from Letterboxd
    if (ratingBarBtnLetterboxd.dataset.testid === "hero-rating-bar__aggregate-rating") {
        console.log("We have a valid IMDb rating. Adding Letterboxd rating to DOM...");

        // set a.href
        let letterboxdElementA = ratingBarBtnLetterboxd.children[1];
        letterboxdElementA.href = letterboxdUrl;

        // edit all its child elements
        let letterboxdElementADiv = letterboxdElementA.children[0].children[0];
        // icon set to 24x24
        letterboxdElementADiv.children[0].innerHTML = '<img src="https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com" alt="" width="24" height="24">';
        // ratings data
        let letterboxdElementRatingDiv = letterboxdElementADiv.children[1];
        // average rating
        letterboxdElementRatingDiv.children[0].children[0].innerHTML = letterboxdRating;
        letterboxdElementRatingDiv.children[0].children[1].innerHTML = "/5";
        // total ratings
        letterboxdElementRatingDiv.children[2].innerHTML = letterboxdTotalRatings != "-" ? numRound(letterboxdTotalRatings) : "-";
        // data-testid
        letterboxdElementRatingDiv.children[0].dataset.testid = "hero-rating-bar__letterboxd-rating";
    }
    // If the cloned node is NOT the IMDb aggregate rating (it doesn't have one) it'll be the button allowing us to rate it if logged in
    // The child nodes of the <button> are very similar so we can still modify the HTML to show the Letterboxd rating, then add our own
    // <div> to display the total number of ratings.
    else if (ratingBarBtnLetterboxd.dataset.testid === "hero-rating-bar__user-rating") {
        console.log("We don't have a valid IMDb rating. Adding Letterboxd link to DOM with manual rate count...");
        let btnNode = ratingBarBtnLetterboxd.children[1];
        let btnChildNode = ratingBarBtnLetterboxd.children[1].children[0];

        // create <a> element
        let letterboxdElementA = document.createElement("a");
        letterboxdElementA.className = btnNode.classList.toString();
        letterboxdElementA.href = letterboxdUrl;
        // clone the <button>'s child node (should be a span) and append it to our <a>
        letterboxdElementA.append(btnChildNode.cloneNode(true));

        // edit all its child elements
        let letterboxdElementADiv = letterboxdElementA.children[0].children[0];
        // icon set to 24x24
        letterboxdElementADiv.children[0].innerHTML = '<img src="https://www.google.com/s2/favicons?sz=64&domain=letterboxd.com" alt="" width="24" height="24">';
        // ratings data container
        let letterboxdElementRatingDiv = letterboxdElementADiv.children[1];
        // average rating
        letterboxdElementRatingDiv.children[0].children[0].innerHTML = letterboxdRating;
        letterboxdElementRatingDiv.children[0].innerHTML = letterboxdElementRatingDiv.children[0].innerHTML.replace("/10", "/5");
        // total ratings (need to make our own div for this)
        let letterboxdTotalRatingsDiv = document.createElement("div");
        letterboxdTotalRatingsDiv.className = "letterboxd-rating-bottom";
        letterboxdTotalRatingsDiv.innerHTML = letterboxdTotalRatings;
        letterboxdElementRatingDiv.append(letterboxdTotalRatingsDiv);

        // replace the <button> with the <a> we created and modified above
        btnNode.replaceWith(letterboxdElementA);
    }
    // If we get this far the film must be an upcoming one that's getting enough attention to trigger the Popularity Meter.
    // We won't have any ratings to display here obviously, but we can at least link to the Letterboxd page for convenience.
    else {
        console.log("We don't have a valid IMDb rating. This is probably an unreleased film. Adding Letterboxd link to DOM...");

        // set a.href
        let letterboxdElementA = ratingBarBtnLetterboxd.children[1];
        letterboxdElementA.href = letterboxdUrl;

        // edit all its child elements
        let letterboxdElementADiv = letterboxdElementA.children[0].children[0];
        // icon set to 24x24
        letterboxdElementADiv.children[0].innerHTML = '<img src="https://www.google.com/s2/favicons?domain=letterboxd.com&sz=64" alt="" width="24" height="24">';
        // replace score and delta and change data-testid
        letterboxdElementADiv.children[1].dataset.testid = "hero-rating-bar__letterboxd-link";
        letterboxdElementADiv.children[1].children[0].dataset.testid = "";
        letterboxdElementADiv.children[1].children[0].innerText = "View";
        letterboxdElementADiv.children[1].children[1].remove();
    }


    // Add the finished element to the DOM
    ratingBarBtnLetterboxd.dataset.testid = "hero-rating-bar__letterboxd-rating";
    ratingBarBtns[0].parentNode.appendChild(ratingBarBtnLetterboxd);
}

function numRound(num)
{
    // https://stackoverflow.com/a/68273755/403476
    num = Math.abs(Number(num))
    const billions = num/1.0e+9
    const millions = num/1.0e+6
    const thousands = num/1.0e+3
    return num >= 1.0e+9 && billions >= 100  ? Math.round(billions)  + "B"
         : num >= 1.0e+9 && billions >= 10   ? billions.toFixed(1)   + "B"
         : num >= 1.0e+9                     ? billions.toFixed(2)   + "B"
         : num >= 1.0e+6 && millions >= 100  ? Math.round(millions)  + "M"
         : num >= 1.0e+6 && millions >= 10   ? millions.toFixed(1)   + "M"
         : num >= 1.0e+6                     ? millions.toFixed(2)   + "M"
         : num >= 1.0e+3 && thousands >= 100 ? Math.round(thousands) + "K"
         : num >= 1.0e+3 && thousands >= 10  ? thousands.toFixed(1)  + "K"
         : num >= 1.0e+3                     ? thousands.toFixed(2)  + "K"
         : num.toFixed()
}