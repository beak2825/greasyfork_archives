// ==UserScript==
// @name         Google Maps Reviews Scraper & Exporter
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Scrapes reviews from Google Maps with a floating interface and improved functionality
// @author       sharmanhall
// @match        https://www.google.com/maps/place/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/510952/Google%20Maps%20Reviews%20Scraper%20%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/510952/Google%20Maps%20Reviews%20Scraper%20%20Exporter.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Add styles for floating panel
    GM_addStyle(`
        #review-scraper-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            font-family: Arial, sans-serif;
        }
        #review-scraper-panel button {
            background-color: #4285f4;
            color: white;
            border: none;
            padding: 8px 12px;
            margin: 5px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #review-scraper-panel button:hover {
            background-color: #3367d6;
        }
        #scraper-status {
            margin-top: 10px;
            font-size: 14px;
        }
    `);
 
    // Create floating panel
    const panel = document.createElement('div');
    panel.id = 'review-scraper-panel';
    panel.innerHTML = `
        <button id="scrape-reviews">Scrape Reviews</button>
        <button id="copy-to-clipboard">Copy to Clipboard</button>
        <div id="scraper-status"></div>
    `;
    document.body.appendChild(panel);
 
    const setStatus = (message) => {
        document.getElementById('scraper-status').textContent = message;
    };
 
    const autoScroll = async () => {
        setStatus('Scrolling to load reviews...');
        let lastScrollHeight = 0, currentScrollHeight = document.documentElement.scrollHeight;
        do {
            lastScrollHeight = currentScrollHeight;
            window.scrollTo(0, currentScrollHeight);
            await new Promise(r => setTimeout(r, 2000));
            currentScrollHeight = document.documentElement.scrollHeight;
        } while(currentScrollHeight > lastScrollHeight);
        window.scrollTo(0, 0);
    };
 
    const expandReviews = async () => {
        setStatus('Expanding truncated reviews...');
        const moreButtons = document.querySelectorAll("button.w8nwRe.kyuRq");
        for (const button of moreButtons) {
            button.click();
            await new Promise(r => setTimeout(r, 500));
        }
    };
 
    const scrapeReviews = async () => {
        await autoScroll();
        await expandReviews();
 
        setStatus('Scraping reviews...');
        const reviewDivs = document.querySelectorAll("div[data-review-id]");
        const reviews = [];
        const scrapedReviewIds = new Set();
 
        for (const reviewDiv of reviewDivs) {
            const reviewId = reviewDiv.getAttribute("data-review-id");
            if (scrapedReviewIds.has(reviewId)) continue;
 
            const review = {
                reviewer_name: reviewDiv.querySelector("div.d4r55")?.textContent.trim() || '',
                img_url: reviewDiv.querySelector("img.NBa7we")?.src.replace('=w36-h36-p-rp-mo-br100', '=s0') || '',
                review_date: reviewDiv.querySelector("span.rsqaWe")?.textContent.trim() || '',
                star_rating: parseInt(reviewDiv.querySelector("span.kvMYJc[role='img']")?.getAttribute("aria-label").match(/(\d+)/)?.[0] || '0', 10),
                review_url: reviewDiv.querySelector("button[data-href]")?.getAttribute("data-href") || '',
                review_content: reviewDiv.querySelector("span.wiI7pd")?.textContent.trim() || ''
            };
 
            scrapedReviewIds.add(reviewId);
            reviews.push(review);
        }
 
        setStatus(`Scraped ${reviews.length} reviews.`);
        return reviews;
    };
 
    const copyToClipboard = async () => {
        const reviews = await scrapeReviews();
        const contentToCopy = JSON.stringify(reviews, null, 2);
        navigator.clipboard.writeText(contentToCopy).then(() => {
            setStatus('Content copied to clipboard!');
        }).catch(err => {
            setStatus('Error copying to clipboard. See console for details.');
            console.error("Could not copy content to clipboard: ", err);
        });
    };
 
    document.getElementById('scrape-reviews').addEventListener('click', scrapeReviews);
    document.getElementById('copy-to-clipboard').addEventListener('click', copyToClipboard);
})();