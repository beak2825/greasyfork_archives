// ==UserScript==
// @name         Slideshow Auto
// @version      1.0
// @description  MFC Slideshow Auto
// @author       You
// @match        https://www.myfavoritecontent.com/list/*
// @grant        none
// @namespace https://greasyfork.org/users/249948
// @downloadURL https://update.greasyfork.org/scripts/381310/Slideshow%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/381310/Slideshow%20Auto.meta.js
// ==/UserScript==

const offerURL = "https://agm.mobi/vc/ng/users/50041208/offers/";
const offerIDs = [160333,150587,330538,144793,330535,330543,332985,330530,330546,332988,
                  332983,330545,330526,330531,332989,332984,332945,330539,330527,332951,
                  330532,140692,332950,160353,332949,330533,330541,330534,330542,330540,
                  330529,332948,330528,330536,332987,332947,150588,330537,332986,330525,
                  332946];
const pageURL = "https://www.myfavoritecontent.com/list/"
const urlIDs = ["25-tips-for-a-happy-dog-and-an-even-happier-you",
                "25-lighthouses-from-around-the-world",
                "25-breathtaking-mountains-to-see-the-next-time-you-travel",
                "25-must-try-drinks",
                "25-man-made-marvels-to-add-to-your-bucket-list",
                "these-25-women-changed-the-world",
                "25-of-the-most-notorious-gangsters",
                "check-out-the-25-most-important-inventions-of-all-time",
                "25-of-the-most-historically-prominent-figures-in-north-american-history",
                "from-top-to-bottom-the-25-most-popular-breeds-of-dogs",
                "countdown-from-25-to-the-worlds-most-spectacular-cathedral",
                "25-crazy-ways-animals-have-adapted-to-their-environment",
                "discover-the-top-25-scientists-in-the-world-today",
                "dont-miss-this-list-of-the-top-25-universities",
                "here-are-the-25-top-athletes-of-the-21st-century",
                "a-list-of-the-25-most-recent-oscar-winning-movies",
                "the-worst-25-bugs-youll-ever-meet",
                "25-ways-to-lower-your-grocery-bill",
                "if-you-dont-have-these-25-cities-on-your-bucket-list",
                "25-paintings-that-have-sold-for-millions",
                "lets-countdown-the-25-largest-animals-on-earth",
                "top-25-must-dos-when-buying-a-used-vehicle",
                "these-are-the-worlds-25-most-celebrated-composers",
                "25-simple-ideas-you-can-use-today-to-help-prevent-alzheimers-disease",
                "check-out-the-top-25-grossing-movies-of-all-time",
                "these-25-cities-are-the-most-expensive-places-to-live",
                "these-are-the-25-tallest-buildings-in-new-york-city",
                "these-25-deadliest-diseases-are-worth-knowing-about",
                "the-worlds-25-most-popular-sports",
                "here-are-the-25-highest-mountain-peaks-in-the-world",
                "25-most-expensive-countries-to-live-in-the-world",
                "check-this-out-to-see-the-top-25-selling-books-of-all-time",
                "the-olympics-said-no-to-these-25-sports",
                "25-fabulous-castles-you-have-to-see-to-believe",
                "this-is-a-list-of-the-25-most-endangered-species",
                "a-fun-list-of-the-top-25-languages-spoken-in-the-world",
                "25-little-ways-to-make-a-big-change-in-your-life",
                "the-top-25-most-dog-friendly-cities-in-the-us",
                "here-are-25-of-the-most-expensive-cars-ever-sold",
                "25-of-the-weirdest-deaths-ever-recorded",
                "25-of-the-worlds-busiest-airports"
               ]

function doStuff() {
    var myUrl = window.location.href;
    var urlIndex, newUrlIndex, newURL;

    for (var i = 0; i < urlIDs.length; i++) {
        if (myUrl.includes(urlIDs[i])) {
            urlIndex = i;
            break;
        }
    }

    var pos = myUrl.lastIndexOf("/");
    var pageIndex = parseInt(myUrl.slice(pos+1));
    if (Number.isInteger(pageIndex)) {
        if (pageIndex < 25) {
            newURL = myUrl.slice(0, pos+1) + (pageIndex+1).toString();
        }
        else {
            if (urlIndex == urlIDs.length - 1) {
                newUrlIndex = 0;
            }
            else {
                newUrlIndex = urlIndex + 1;
            }
            newURL = offerURL + offerIDs[newUrlIndex].toString() + "?";
        }
    }
    else {
        newURL = pageURL + urlIDs[urlIndex] + "/1";
    }

    window.location.href = newURL;
}

setInterval(doStuff, 2000)