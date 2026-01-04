// ==UserScript==
// @name         RYM out-of-10
// @namespace    http://tampermonkey.net/
// @version      2024-06-10
// @description  Replace RYM's rating out of five to out of ten.
// @author       You
// @match        https://rateyourmusic.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496347/RYM%20out-of-10.user.js
// @updateURL https://update.greasyfork.org/scripts/496347/RYM%20out-of-10.meta.js
// ==/UserScript==

const RYM_PROCESSED_TAG = "data-rym-processed";
const SHOW_STARS_AS_TEXT = true;
const $$ = x => Array.from(document.querySelectorAll(x));

function flagAsRYMProcessed(el) {
    if (el.getAttribute(RYM_PROCESSED_TAG)) {
        return false;
    }
    el.setAttribute(RYM_PROCESSED_TAG, 1);
    return true;
}

function renderStars(ratingOutOfTen) {
    if (SHOW_STARS_AS_TEXT) {
        return `<span style="color: var(--mono-0)">Rating: <b>${ratingOutOfTen}</b></span>`;
    } else {
        const ratingImg1 = ratingOutOfTen >= 5 ? "https://e.snmc.io/2.5/img/images/10m.png" : `https://e.snmc.io/2.5/img/images/${ratingImg1}m.png`;
        const ratingImg2 = ratingOutOfTen >= 5 ? `https://e.snmc.io/2.5/img/images/${ratingOutOfTen - 5}m.png` : "https://e.snmc.io/2.5/img/images/0m.png";

        return `<img src="${ratingImg1}"><img src="${ratingImg2}">`;
    }
}

function convertToRatingOutOfTen(rating) {
    const result = parseFloat(rating) * 2;
    if (isNaN(result)) {
        return rating;
    }
    return result;
}

function process() {
    const $ = x => document.querySelector(x);

    if ($(".avg_rating") && flagAsRYMProcessed($(".avg_rating"))) {
        $(".avg_rating").innerHTML = parseFloat($(".avg_rating").innerHTML) * 2;
    }
    if ($(".max_rating") && flagAsRYMProcessed($(".max_rating"))) {
        $(".max_rating").innerHTML = `<span class="max_rating">/ <span>10</span></span>`;
    }

    // Rating Based on innerHTML
    for (const x of
         $$(".track_rating_avg, .newreleases_avg_rating_stat, .disco_avg_rating, .disco_cat_inner, .component_discography_item_details_average,"
            + ".page_charts_section_charts_item_details_average_num, #musicrating > table > tbody > tr > td > a")) {
        if (!flagAsRYMProcessed(x)) {
            continue;
        }
        x.innerHTML = convertToRatingOutOfTen(x.innerHTML);
    }

    // Rating based on attr content
    for (const x of $$("[itemprop='ratingValue']")) {
        if (!flagAsRYMProcessed(x)) {
            continue;
        }
        const ratingOutOfTen = parseFloat(x.getAttribute("content")) * 2;
        x.innerHTML = renderStars(ratingOutOfTen);
    }

    // Rating based on img alt
    for (const x of $$(".catalog_rating, .or_q_rating_date_s, .review_rating")) {
        if (!flagAsRYMProcessed(x) || !x.querySelector("img")) {
            continue;
        }
        const ratingOutOfTen = parseFloat(x.querySelector("img").getAttribute("alt").split(" ")[0]) * 2;
        x.querySelector("img").outerHTML = renderStars(ratingOutOfTen);
    }

    // Rating based on b
    for (const x of $$(".page_features_secondary_metadata_rating_final")) {
        if (!flagAsRYMProcessed(x)) {
            continue;
        }

        const ratingOutOfTen = convertToRatingOutOfTen(x.querySelector("b").innerHTML) ;
        x.querySelector("b").innerHTML = ratingOutOfTen;
    }
    // Rating based on attr content
    for (const x of $$(".page_review_feature_rating")) {
        if (!flagAsRYMProcessed(x)) {
            continue;
        }

        const ratingOutOfTen = parseFloat(x.getAttribute("content")) * 2;
        x.innerHTML = renderStars(ratingOutOfTen);
    }
}

function insertRatingOutOfTenSelect() {
    const $ = x => document.querySelector(x);
    const ratingOutOfFive = $("[id^=my_catalog_rating_]");
    if (!ratingOutOfFive) {
        return;
    }

    const rymClass = eval(ratingOutOfFive.getAttribute("onclick").split(".")[0]);
    ratingOutOfFive.setAttribute("onclick", "");
    // ratingOutOfFive.remove();

    let options = "";
    for (let i = 0; i <= 10; i ++) {
        let isSelected = "";
        if (rymClass.rating === i) {
            isSelected = "selected";
        };
        options += `<option value="${i}" ${isSelected}>${i > 0 ? i : "-"}</option>`;
    }
    window.onRatingOutOfTenSelectChange = event => {
       rymClass.setRating(parseInt(event.target.value));
    };
    $(".release_my_catalog").innerHTML = `
        <select
            onchange="window.onRatingOutOfTenSelectChange(event)"
            style="height: 32px!important; margin-right: 5px">
            ${options}
        </select>` + $(".release_my_catalog").innerHTML;
}


function startObserver() {
    const targetNode = document.querySelector("body");
    const config = { attributes: false, childList: true, subtree: true };

    const callback = (mutationList, observer) => {
        process();
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

window.addEventListener("load", () => {
    process();
    startObserver();
    insertRatingOutOfTenSelect();
});

document.addEventListener("load", () => process());