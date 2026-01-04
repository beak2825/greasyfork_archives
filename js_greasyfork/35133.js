// ==UserScript==
// @name        Giant Bomb reviewer images
// @namespace   https://github.com/KamasamaK/gb-review-images
// @description Inserts reviewer images into reviews on newer website designs
// @match       https://*.giantbomb.com/reviews/*
// @homepageURL https://github.com/KamasamaK/gb-review-images
// @supportURL  https://github.com/KamasamaK/gb-review-images/issues
// @version     1.5.2
// @author      KamasamaK
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/35133/Giant%20Bomb%20reviewer%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/35133/Giant%20Bomb%20reviewer%20images.meta.js
// ==/UserScript==

/*
 This script is subject to fail on a future redesign of the website
 Thanks to Ben Coello for creating the images for the original members
 Thanks to Giant Bomb user papercut for providing the Alex and Patrick images used here
*/
(function () {
    "use strict";

    var parentElems = document.getElementsByClassName("news-hdr");
    if (parentElems.length === 0) {
        return false;
    }
    var parentElem = parentElems[0];

    var reviewerName = document.getElementsByClassName("news-byline")[0].getElementsByTagName("a")[0].textContent;
    var scoreElem = document.getElementsByClassName("score score-big score-special")[0];
    var numberScore = scoreElem.getElementsByTagName("span")[0].textContent;
    var systemListElem = document.getElementsByClassName("system-list")[0];

    var imgElem = document.createElement("img");
    imgElem.setAttribute("height", "150");
    imgElem.setAttribute("align", "left");

    var reviewerImages = {};
    reviewerImages["Jeff Gerstmann"] = {
        "1": "https://www.giantbomb.com/a/uploads/original/0/9253/2492756-jeff-1.png",
        "2": "https://www.giantbomb.com/a/uploads/original/0/9253/2492757-jeff-2.png",
        "3": "https://www.giantbomb.com/a/uploads/original/0/9253/2492758-jeff-3.png",
        "4": "https://www.giantbomb.com/a/uploads/original/0/9253/2492759-jeff-4.png",
        "5": "https://www.giantbomb.com/a/uploads/original/0/9253/2492760-jeff-5.png"
    };
    reviewerImages["Brad Shoemaker"] = {
        "1": "https://www.giantbomb.com/a/uploads/original/0/9253/2492750-brad-1.png",
        "2": "https://www.giantbomb.com/a/uploads/original/0/9253/2492751-brad-2.png",
        "3": "https://www.giantbomb.com/a/uploads/original/0/9253/2492753-brad-3.png",
        "4": "https://www.giantbomb.com/a/uploads/original/0/9253/2492754-brad-4.png",
        "5": "https://www.giantbomb.com/a/uploads/original/0/9253/2492755-brad-5.png"
    };
    reviewerImages["Ryan Davis"] = {
        "1": "https://www.giantbomb.com/a/uploads/original/0/9253/2492761-ryan-1.png",
        "2": "https://www.giantbomb.com/a/uploads/original/0/9253/2492762-ryan-2.png",
        "3": "https://www.giantbomb.com/a/uploads/original/0/9253/2492763-ryan-3.png",
        "4": "https://www.giantbomb.com/a/uploads/original/0/9253/2492764-ryan-4.png",
        "5": "https://www.giantbomb.com/a/uploads/original/0/9253/2492765-ryan-5.png"
    };
    reviewerImages["Vinny Caravella"] = {
        "1": "https://www.giantbomb.com/a/uploads/original/0/9253/2492766-vinny-1.png",
        "2": "https://www.giantbomb.com/a/uploads/original/0/9253/2492767-vinny-2.png",
        "3": "https://www.giantbomb.com/a/uploads/original/0/9253/2492768-vinny-3.png",
        "4": "https://www.giantbomb.com/a/uploads/original/0/9253/2492769-vinny-4.png",
        "5": "https://www.giantbomb.com/a/uploads/original/0/9253/2492770-vinny-5.png"
    };
    reviewerImages["Alex Navarro"] = {
        "1": "https://www.giantbomb.com/a/uploads/original/0/9253/2337134-alex_1.png",
        "2": "https://www.giantbomb.com/a/uploads/original/0/9253/2337135-alex_2.png",
        "3": "https://www.giantbomb.com/a/uploads/original/0/9253/2337136-alex_3.png",
        "4": "https://www.giantbomb.com/a/uploads/original/0/9253/2337137-alex_4.png",
        "5": "https://www.giantbomb.com/a/uploads/original/0/9253/2337138-alex_5.png"
    };
    reviewerImages["Patrick Klepek"] = {
        "1": "https://www.giantbomb.com/a/uploads/original/0/9253/2336676-patrick_1.png",
        "2": "https://www.giantbomb.com/a/uploads/original/0/9253/2336677-patrick_2.png",
        "3": "https://www.giantbomb.com/a/uploads/original/0/9253/2336678-patrick_3.png",
        "4": "https://www.giantbomb.com/a/uploads/original/0/9253/2336679-patrick_4.png",
        "5": "https://www.giantbomb.com/a/uploads/original/0/9253/2336680-patrick_5.png"
    };

    var additionalReviewerImages = {
        "Dave Snider": "https://www.giantbomb.com/a/uploads/original/0/9253/2492775-snide.png",
        "Drew Scanlon": "https://www.giantbomb.com/a/uploads/original/0/9253/2492773-drewbert.png",
        "Matt Kessler": "https://www.giantbomb.com/a/uploads/original/0/9253/2492774-mattbodega.png",
        "Andy McCurdy": "https://www.giantbomb.com/a/uploads/original/0/9253/2492772-andy.png"
    };

    if (reviewerImages.hasOwnProperty(reviewerName) && reviewerImages[reviewerName][numberScore]) {
        imgElem.setAttribute("src", reviewerImages[reviewerName][numberScore]);
    } else if (additionalReviewerImages.hasOwnProperty(reviewerName)) {
        imgElem.setAttribute("src", additionalReviewerImages[reviewerName]);
    } else {
        return false;
    }

    parentElem.insertBefore(imgElem, scoreElem);
    // Use CSS instead?
    parentElem.insertBefore(document.createElement("br"), scoreElem);
    parentElem.insertBefore(document.createElement("br"), systemListElem);
    parentElem.insertBefore(document.createElement("br"), systemListElem);
    parentElem.insertBefore(document.createElement("br"), systemListElem);
})();
