// ==UserScript==
// @name         Google Reviews Batch to JSON
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Scrapes reviews from Google Maps, expands truncated content, and exports to clipboard
// @author       sharmanhall
// @match        https://www.google.com/maps/place/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478310/Google%20Reviews%20Batch%20to%20JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/478310/Google%20Reviews%20Batch%20to%20JSON.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scrapeReviews = async () => {
        const reviewDivs = document.querySelectorAll("div[data-review-id]");
        const reviews = [];

        for (const reviewDiv of reviewDivs) {
            const review = {};

            const reviewerName = reviewDiv.querySelector("div.d4r55");
            if (reviewerName) review.reviewer_name = reviewerName.textContent.trim();

            const img = reviewDiv.querySelector("img.NBa7we");
            if (img) review.img_url = img.src;

            const dateSpan = reviewDiv.querySelector("span.rsqaWe");
            if (dateSpan) review.review_date = dateSpan.textContent.trim();

            const stars = reviewDiv.querySelectorAll("img.hCCjke.vzX5Ic");
            if (stars) review.star_rating = stars.length;

            const reviewButton = reviewDiv.querySelector("button[data-href]");
            if (reviewButton) review.review_url = reviewButton.getAttribute("data-href");

            let reviewContentSpan = reviewDiv.querySelector("span.wiI7pd");
            if (reviewContentSpan) {
                const moreButton = reviewDiv.querySelector("button.w8nwRe.kyuRq");
                if (moreButton) {
                    moreButton.click();
                    await new Promise(r => setTimeout(r, 500));
                }

                reviewContentSpan = reviewDiv.querySelector("span.wiI7pd");
                review.review_content = reviewContentSpan.textContent.trim();
            }

            reviews.push(review);
        }

        console.log("%c Scrape Results:", "font-size: 24px; font-weight: bold;");
        reviews.forEach((review, idx) => {
            console.log(`%c Review #${idx+1}`, "font-size: 20px; font-weight: bold;");
            console.log(`%cReviewer Name: ${review.reviewer_name}`, "font-size: 18px;");
            console.log(`%cImage URL: ${review.img_url}`, "font-size: 18px;");
            console.log(`%cReview Date: ${review.review_date}`, "font-size: 18px;");
            console.log(`%cStar Rating: ${review.star_rating}`, "font-size: 18px;");
            console.log(`%cReview URL: ${review.review_url}`, "font-size: 18px; color: blue;");
            console.log(`%cReview Content: ${review.review_content}`, "font-size: 18px;");
            console.log(" ");
        });

        return reviews;
    };

    const copyToClipboard = async () => {
        const reviews = await scrapeReviews();

        const contentToCopy = JSON.stringify(reviews, null, 2);
        navigator.clipboard.writeText(contentToCopy).then(() => {
            console.log("%c Content copied to clipboard!", "font-size: 24px; font-weight: bold; color: green;");
        }).catch(err => {
            console.error("Could not copy content to clipboard: ", err);
        });
    };

    const createButton = (label, actionFunc) => {
        const button = document.createElement("button");
        button.className = "g88MCb S9kvJb";
        button.setAttribute("aria-label", label);
        button.innerHTML = `<span class="DVeyrd "><div class="OyjIsf zemfqc"></div><span class="Cw1rxd google-symbols"></span><span class="GMtm7c fontTitleSmall">${label}</span></span>`;
        button.onclick = actionFunc;
        return button;
    }

    const scrapeButton = createButton("Scrape Reviews", scrapeReviews);
    const copyButton = createButton("Copy to Clipboard", copyToClipboard);

    const writeReviewDiv = document.querySelector("div.m6QErb.Hk4XGb.QoaCgb.KoSBEe.tLjsW");
    if (writeReviewDiv) {
        [scrapeButton, copyButton].forEach(btn => {
            const buttonWrapper = document.createElement("div");
            buttonWrapper.className = "TrU0dc kdfrQc";
            buttonWrapper.appendChild(btn);
            writeReviewDiv.appendChild(buttonWrapper);
        });
    }
})();
