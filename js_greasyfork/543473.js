// ==UserScript==
// @name         Google Maps Reviews Scraper & Exporter (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  Scrapes reviews from Google Maps with improved date handling and photo extraction
// @author       sharmanhall
// @match        https://www.google.com/maps/place/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/543473/Google%20Maps%20Reviews%20Scraper%20%20Exporter%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543473/Google%20Maps%20Reviews%20Scraper%20%20Exporter%20%28Enhanced%29.meta.js
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
            min-width: 200px;
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
            width: 100%;
        }
        #review-scraper-panel button:hover {
            background-color: #3367d6;
        }
        #scraper-status {
            margin-top: 10px;
            font-size: 12px;
            color: #666;
        }
        .scraper-progress {
            background-color: #e8f0fe;
            border-radius: 4px;
            padding: 5px;
            margin-top: 5px;
        }
    `);
 
    // Create floating panel
    const panel = document.createElement('div');
    panel.id = 'review-scraper-panel';
    panel.innerHTML = `
        <button id="scrape-reviews">Scrape Reviews</button>
        <button id="copy-to-clipboard">Copy to Clipboard</button>
        <button id="export-csv">Export as CSV</button>
        <div id="scraper-status"></div>
    `;
    document.body.appendChild(panel);
 
    const setStatus = (message) => {
        const statusDiv = document.getElementById('scraper-status');
        statusDiv.innerHTML = `<div class="scraper-progress">${message}</div>`;
    };

    // Enhanced date parsing function
    const parseReviewDate = (dateText) => {
        if (!dateText) return { raw_date: '', estimated_date: '' };
        
        const now = new Date();
        const rawDate = dateText.trim();
        let estimatedDate = '';
        
        try {
            // Handle relative dates
            if (rawDate.includes('ago')) {
                const timeMatch = rawDate.match(/(\d+)\s+(second|minute|hour|day|week|month|year)s?\s+ago/i);
                if (timeMatch) {
                    const [, amount, unit] = timeMatch;
                    const num = parseInt(amount);
                    const date = new Date(now);
                    
                    switch(unit.toLowerCase()) {
                        case 'second': date.setSeconds(date.getSeconds() - num); break;
                        case 'minute': date.setMinutes(date.getMinutes() - num); break;
                        case 'hour': date.setHours(date.getHours() - num); break;
                        case 'day': date.setDate(date.getDate() - num); break;
                        case 'week': date.setDate(date.getDate() - (num * 7)); break;
                        case 'month': date.setMonth(date.getMonth() - num); break;
                        case 'year': date.setFullYear(date.getFullYear() - num); break;
                    }
                    estimatedDate = date.toISOString().split('T')[0];
                }
            } else {
                // Try to parse absolute dates
                const parsedDate = new Date(rawDate);
                if (!isNaN(parsedDate.getTime())) {
                    estimatedDate = parsedDate.toISOString().split('T')[0];
                }
            }
        } catch (e) {
            console.warn('Date parsing error:', e);
        }
        
        return {
            raw_date: rawDate,
            estimated_date: estimatedDate || 'unknown'
        };
    };

    // Extract review photos - Updated based on actual Google Maps HTML structure
    const extractReviewPhotos = (reviewDiv) => {
        const photos = [];
        
        // Look for the specific photo container class from Google Maps
        const photoContainer = reviewDiv.querySelector('.KtCyie');
        if (photoContainer) {
            // Find photo buttons with background images
            const photoButtons = photoContainer.querySelectorAll('button.Tya61d[style*="background-image"]');
            photoButtons.forEach(button => {
                if (button.style.backgroundImage) {
                    const bgMatch = button.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                    if (bgMatch && bgMatch[1]) {
                        let photoUrl = bgMatch[1];
                        
                        // Filter out profile pictures (they contain /a- or /a/)
                        if (!photoUrl.includes('/a-/') && !photoUrl.includes('/a/')) {
                            // Upgrade to higher resolution if possible
                            if (photoUrl.includes('=w') && photoUrl.includes('-h')) {
                                photoUrl = photoUrl.replace(/=w\d+-h\d+([^=]*)?/g, '=w1920-h1080-k-no');
                            }
                            
                            if (!photos.includes(photoUrl)) {
                                photos.push(photoUrl);
                            }
                        }
                    }
                }
            });
        }
        
        // Backup: Look for any other elements with background images containing googleusercontent
        const elementsWithBg = reviewDiv.querySelectorAll('[style*="googleusercontent.com"]');
        elementsWithBg.forEach(element => {
            if (element.style.backgroundImage) {
                const bgMatch = element.style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                if (bgMatch && bgMatch[1]) {
                    let photoUrl = bgMatch[1];
                    
                    // Only include review photos, not profile pictures
                    if (photoUrl.includes('googleusercontent.com') && 
                        !photoUrl.includes('/a-/') && 
                        !photoUrl.includes('/a/') &&
                        !photoUrl.includes('avatar') &&
                        !photoUrl.includes('NBa7we')) {  // NBa7we is the profile image class
                        
                        // Upgrade resolution
                        if (photoUrl.includes('=w') && photoUrl.includes('-h')) {
                            photoUrl = photoUrl.replace(/=w\d+-h\d+([^=]*)?/g, '=w1920-h1080-k-no');
                        }
                        
                        if (!photos.includes(photoUrl)) {
                            photos.push(photoUrl);
                        }
                    }
                }
            }
        });
        
        return photos;
    };
 
    const autoScroll = async () => {
        setStatus('Auto-scrolling to load all reviews...');
        
        // Try to find and scroll within the reviews container
        const reviewsContainer = document.querySelector('.m6QErb[data-value="Sort"]')?.parentElement?.parentElement;
        
        if (reviewsContainer) {
            let lastScrollHeight = 0;
            let currentScrollHeight = reviewsContainer.scrollHeight;
            let scrollAttempts = 0;
            
            do {
                lastScrollHeight = currentScrollHeight;
                reviewsContainer.scrollTo(0, currentScrollHeight);
                await new Promise(r => setTimeout(r, 2000));
                currentScrollHeight = reviewsContainer.scrollHeight;
                scrollAttempts++;
                
                setStatus(`Loading reviews... (attempt ${scrollAttempts})`);
                
                // Prevent infinite loops
                if (scrollAttempts > 50) break;
                
            } while(currentScrollHeight > lastScrollHeight);
            
            reviewsContainer.scrollTo(0, 0);
        } else {
            // Fallback to window scrolling
            let lastScrollHeight = 0;
            let currentScrollHeight = document.documentElement.scrollHeight;
            
            do {
                lastScrollHeight = currentScrollHeight;
                window.scrollTo(0, currentScrollHeight);
                await new Promise(r => setTimeout(r, 2000));
                currentScrollHeight = document.documentElement.scrollHeight;
            } while(currentScrollHeight > lastScrollHeight);
            
            window.scrollTo(0, 0);
        }
    };
 
    const expandReviews = async () => {
        setStatus('Expanding truncated reviews...');
        
        // Multiple selectors for "More" buttons
        const moreButtonSelectors = [
            "button.w8nwRe.kyuRq",
            "button[aria-label*='more']",
            "button.review-more-link",
            ".review-full-text button"
        ];
        
        for (const selector of moreButtonSelectors) {
            const moreButtons = document.querySelectorAll(selector);
            for (const button of moreButtons) {
                if (button.textContent.toLowerCase().includes('more') || 
                    button.getAttribute('aria-label')?.toLowerCase().includes('more')) {
                    button.click();
                    await new Promise(r => setTimeout(r, 300));
                }
            }
        }
    };
 
    const scrapeReviews = async () => {
        await autoScroll();
        await expandReviews();
 
        setStatus('Extracting review data...');
        const reviewDivs = document.querySelectorAll("div[data-review-id]");
        const reviews = [];
        const scrapedReviewIds = new Set();
 
        for (let i = 0; i < reviewDivs.length; i++) {
            const reviewDiv = reviewDivs[i];
            const reviewId = reviewDiv.getAttribute("data-review-id");
            
            if (scrapedReviewIds.has(reviewId)) continue;
            
            setStatus(`Processing review ${i + 1} of ${reviewDivs.length}...`);
            
            // Extract date information
            const dateElement = reviewDiv.querySelector("span.rsqaWe");
            const dateInfo = parseReviewDate(dateElement?.textContent);
            
            // Extract photos
            const reviewPhotos = extractReviewPhotos(reviewDiv);
            
            // Extract star rating more reliably
            const starElement = reviewDiv.querySelector("span.kvMYJc[role='img']");
            let starRating = 0;
            if (starElement) {
                const ariaLabel = starElement.getAttribute("aria-label");
                const ratingMatch = ariaLabel?.match(/(\d+)/);
                starRating = ratingMatch ? parseInt(ratingMatch[0]) : 0;
            }
            
            // Extract reviewer information
            const reviewerElement = reviewDiv.querySelector("div.d4r55");
            const reviewerName = reviewerElement?.textContent.trim() || '';
            
            // Get profile image with higher resolution
            const profileImg = reviewDiv.querySelector("img.NBa7we");
            let profileImgUrl = '';
            if (profileImg?.src) {
                profileImgUrl = profileImg.src.replace('=w36-h36-p-rp-mo-br100', '=s200');
            }
            
            const review = {
                reviewer_name: reviewerName,
                profile_img_url: profileImgUrl,
                review_date_raw: dateInfo.raw_date,
                review_date_estimated: dateInfo.estimated_date,
                star_rating: starRating,
                review_url: reviewDiv.querySelector("button[data-href]")?.getAttribute("data-href") || '',
                review_content: reviewDiv.querySelector("span.wiI7pd")?.textContent.trim() || '',
                review_photos: reviewPhotos,
                review_id: reviewId,
                scraped_at: new Date().toISOString()
            };
 
            scrapedReviewIds.add(reviewId);
            reviews.push(review);
        }
 
        setStatus(`✅ Successfully scraped ${reviews.length} reviews with enhanced data!`);
        window.scrapedReviews = reviews; // Store globally for other functions
        return reviews;
    };
 
    const copyToClipboard = async () => {
        const reviews = window.scrapedReviews || await scrapeReviews();
        const contentToCopy = JSON.stringify(reviews, null, 2);
        
        try {
            await navigator.clipboard.writeText(contentToCopy);
            setStatus(`✅ ${reviews.length} reviews copied to clipboard as JSON!`);
        } catch (err) {
            setStatus('❌ Error copying to clipboard. Check console.');
            console.error("Could not copy content to clipboard: ", err);
        }
    };

    const exportAsCSV = async () => {
        const reviews = window.scrapedReviews || await scrapeReviews();
        
        // CSV headers
        const headers = [
            'reviewer_name',
            'profile_img_url', 
            'review_date_raw',
            'review_date_estimated',
            'star_rating',
            'review_url',
            'review_content',
            'review_photos',
            'review_id',
            'scraped_at'
        ];
        
        // Convert to CSV
        const csvContent = [
            headers.join(','),
            ...reviews.map(review => 
                headers.map(header => {
                    let value = review[header];
                    if (Array.isArray(value)) {
                        value = value.join('; ');
                    }
                    // Escape quotes and wrap in quotes if contains comma or quote
                    value = String(value).replace(/"/g, '""');
                    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                        value = `"${value}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `google_maps_reviews_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setStatus(`✅ CSV file downloaded with ${reviews.length} reviews!`);
    };
 
    // Event listeners
    document.getElementById('scrape-reviews').addEventListener('click', scrapeReviews);
    document.getElementById('copy-to-clipboard').addEventListener('click', copyToClipboard);
    document.getElementById('export-csv').addEventListener('click', exportAsCSV);
    
    // Initialize
    setStatus('Ready to scrape reviews! 🚀');
})();