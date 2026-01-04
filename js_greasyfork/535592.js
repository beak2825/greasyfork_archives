// ==UserScript==
// @name         OLX Premium Redesign with Background Images
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Completely transforms OLX listings with beautiful background images and modern design
// @author       im tired of this
// @match        https://www.olx.bg/*
// @grant        GM_xmlhttpRequest
// @connect      olx.bg
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535592/OLX%20Premium%20Redesign%20with%20Background%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/535592/OLX%20Premium%20Redesign%20with%20Background%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Cache for fetched data and processed pages/cards
    const dataCache = {};
    const processedPages = new Set();
    const processedCards = new Set();

    // Track current page and max page
    let currentPage = 1;
    let maxPage = 1;
    let isLoadingMorePages = false;

    // Placeholder image URL
    const PLACEHOLDER_IMAGE = "https://www.olx.bg/app/static/media/no_thumbnail.15f456ec5.svg";

    // Settings stored in localStorage
    const getSettings = () => {
        const defaultSettings = {
            hidePromoted: false
        };

        try {
            const stored = localStorage.getItem('olx-enhanced-settings');
            return stored ? JSON.parse(stored) : defaultSettings;
        } catch (e) {
            console.error('Error loading settings:', e);
            return defaultSettings;
        }
    };

    const saveSettings = (settings) => {
        try {
            localStorage.setItem('olx-enhanced-settings', JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    };

    // Add our stylesheet
    const addStyles = () => {
        if (document.getElementById('olx-premium-styles')) return;

        const style = document.createElement('style');
        style.id = 'olx-premium-styles';
        style.textContent = `
            /* Enhanced card with background image */
            .olx-card {
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 20px;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 40, 44, 0.15);
                transition: transform 0.2s, box-shadow 0.2s;
                background-color: white;
                z-index: 1;
                min-height: 200px;
            }

            .olx-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 16px rgba(0, 40, 44, 0.2);
            }

            /* Background image overlay */
            .olx-bg-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                opacity: 0.12;
                z-index: -1;
                filter: blur(3px);
                transform: scale(1.1);
            }

            /* Main card content */
            .olx-content {
                position: relative;
                display: flex;
                flex-direction: column;
                height: 100%;
                z-index: 2;
            }

            /* Top section with tags, title, date and price */
            .olx-top {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                margin-bottom: 15px;
            }

            /* Tags and title container */
            .olx-title-section {
                flex: 1;
                padding-right: 20px;
            }

            /* Tags row */
            .olx-tags {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
                align-items: center;
            }

            /* Individual tags */
            .olx-tag {
                display: inline-flex;
                align-items: center;
                height: 24px;
                padding: 0 12px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: bold;
                text-transform: uppercase;
            }

            .olx-condition-tag {
                background: #23e5db;
                color: white;
            }

            .olx-promoted-tag {
                background: #ff9800;
                color: white;
            }

            .olx-delivery-tag {
                background: #4caf50;
                color: white;
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }

            /* Title */
            .olx-title {
                font-size: 25px;
                font-weight: bold;
                color: #002f34;
                line-height: 1.3;
            }

            /* Price and date section */
            .olx-price-section {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            /* Date above price */
            .olx-date {
                font-size: 16px;
                color: #406367;
                margin-bottom: 6px;
            }

            /* Price */
            .olx-price {
                font-size: 40px;
                font-weight: bold;
                color: #005f64;
            }

            /* Middle section with thumbnail gallery */
            .olx-middle {
                display: flex;
                margin: 15px 0;
            }

            /* Gallery */
            .olx-gallery {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 15px;
                justify-content: flex-start;
            }

            .olx-thumb {
                width: 100px;
                height: 100px;
                border-radius: 8px;
                border: 2px solid #e0e0e0;
                cursor: pointer;
                object-fit: cover;
                transition: transform 0.15s, border-color 0.15s;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            }

            .olx-thumb:hover {
                transform: scale(1.05);
                border-color: #23e5db;
            }

            /* Description */
            .olx-desc {
                font-size: 16px;
                line-height: 1.5;
                color: #406367;
                padding: 15px;
                background: rgba(248, 251, 251, 0.5);
                border-radius: 8px;
                margin-bottom: 15px;
                overflow: hidden;
                max-height: 145px;
                position: relative;
                transition: max-height 0.3s;
                border: 1px solid rgba(238, 242, 242, 0.8);
            }

            .olx-desc.expanded {
                max-height: 1000px;
            }

            .olx-desc.short {
                max-height: none;
            }

            .olx-desc:not(.expanded):not(.short)::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 25px;
                background: linear-gradient(transparent, rgba(248, 251, 251, 0.9));
            }

            .olx-toggle {
                color: #23e5db;
                cursor: pointer;
                font-size: 15px;
                margin-bottom: 15px;
                display: inline-block;
                user-select: none;
                font-weight: bold;
            }

            .olx-toggle:hover {
                text-decoration: underline;
            }

            /* Bottom section with actions and location */
            .olx-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: auto;
            }

            /* Action buttons */
            .olx-actions {
                display: flex;
                gap: 10px;
            }

            .olx-follow {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 8px 15px;
                background: #f0f4f4;
                color: #406367;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.2s;
                border: none;
            }

            .olx-follow:hover {
                background: #e6eaea;
            }

            .olx-original {
                padding: 8px 15px;
                background: #002f34;
                color: white;
                border-radius: 6px;
                text-decoration: none;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                font-weight: bold;
                transition: background 0.2s;
            }

            .olx-original:hover {
                background: #00484e;
            }

            /* Location */
            .olx-location {
                font-size: 18px;
                color: #23e5db;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }

            .olx-location:hover {
                text-decoration: underline;
            }

            /* Infinite scroll loader */
            .olx-loader {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #406367;
            }

            .olx-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(0,0,0,0.1);
                border-radius: 50%;
                border-top-color: #23e5db;
                animation: olx-spin 1s linear infinite;
                margin-right: 10px;
            }

            @keyframes olx-spin {
                to { transform: rotate(360deg); }
            }

            /* Image modal */
            .olx-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 9999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .olx-modal-img {
                max-width: 90%;
                max-height: 80vh;
                object-fit: contain;
            }

            .olx-modal-controls {
                display: flex;
                gap: 30px;
                margin-top: 20px;
            }

            .olx-modal-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }

            .olx-modal-btn:hover {
                background: rgba(255,255,255,0.3);
            }

            .olx-modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                color: white;
                background: none;
                border: none;
                font-size: 30px;
                cursor: pointer;
            }

            /* Filter controls */
            .olx-filter-control {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                color: #406367;
                cursor: pointer;
                user-select: none;
            }

            .olx-filter-control:hover {
                color: #002f34;
            }

            .olx-switch {
                position: relative;
                display: inline-block;
                width: 36px;
                height: 20px;
            }

            .olx-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .olx-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .3s;
                border-radius: 20px;
            }

            .olx-slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }

            input:checked + .olx-slider {
                background-color: #23e5db;
            }

            input:checked + .olx-slider:before {
                transform: translateX(16px);
            }

            /* Hide promoted cards if filter is on */
            div[data-olx-promoted="true"].olx-hide-promoted {
                display: none !important;
            }

            /* Media query for smaller screens */
            @media (max-width: 768px) {
                .olx-top {
                    flex-direction: column;
                }

                .olx-price-section {
                    align-items: flex-start;
                    margin-top: 10px;
                }

                .olx-price {
                    font-size: 30px;
                }

                .olx-bottom {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 15px;
                }

                .olx-location {
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Create an image modal
    const setupImageModal = () => {
        if (document.getElementById('olx-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'olx-modal';
        modal.className = 'olx-modal';
        modal.style.display = 'none';

        modal.innerHTML = `
            <button class="olx-modal-close" aria-label="Close">&times;</button>
            <img src="" class="olx-modal-img" alt="Product image">
            <div class="olx-modal-controls">
                <button class="olx-modal-btn olx-prev">&lt; Previous</button>
                <button class="olx-modal-btn olx-next">Next &gt;</button>
            </div>
        `;

        document.body.appendChild(modal);

        let currentImages = [];
        let currentIndex = 0;

        const img = modal.querySelector('.olx-modal-img');
        const prevBtn = modal.querySelector('.olx-prev');
        const nextBtn = modal.querySelector('.olx-next');
        const closeBtn = modal.querySelector('.olx-modal-close');

        // Update image
        const updateImage = () => {
            img.src = currentImages[currentIndex];
            img.alt = `Image ${currentIndex + 1} of ${currentImages.length}`;
        };

        // Close button
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        // Previous button
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateImage();
        });

        // Next button
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateImage();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'none') return;

            if (e.key === 'Escape') {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        });

        // Expose function to show images
        window.showOlxModal = (images, index = 0) => {
            currentImages = images;
            currentIndex = index;
            updateImage();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
    };

    // Extract listing data from a card element
    const extractCardData = (card) => {
        const data = {
            title: '',
            price: '',
            url: '',
            location: '',
            date: '',
            condition: '',
            promoted: false,
            delivery: false,
            image: '',
            images: []
        };

        // Get URL
        const link = card.querySelector('a.css-1tqlkj0');
        if (link) {
            data.url = link.getAttribute('href');
        }

        // Get title
        const title = card.querySelector('h4.css-1g61gc2');
        if (title) {
            data.title = title.textContent.trim();
        }

        // Get price
        const price = card.querySelector('p[data-testid="ad-price"]');
        if (price) {
            // Get the raw price text
            const rawPriceText = price.textContent.trim();

            // Check for "Безплатно" (Free) and replace with "0 лв."
            if (rawPriceText.includes('Безплатно')) {
                data.price = '0 лв.';
            } else {
                // Regular price processing
                let priceText = rawPriceText;

                // Clean up any CSS classes that might be in the text
                priceText = priceText.replace(/\.css-.*$/, '');

                // Remove any other non-standard content
                priceText = priceText.replace(/[^\d\s.,лв€$£¥]+/g, '');

                // Remove any extra "в" character that sometimes appears
                priceText = priceText.replace(' в', '');

                data.price = priceText;
            }
        }

        // Get location and date
        const locationDate = card.querySelector('p[data-testid="location-date"]');
        if (locationDate) {
            const locationDateText = locationDate.textContent.trim();
            const parts = locationDateText.split(' - ');

            if (parts.length > 1) {
                data.location = parts[0].trim();
                data.date = parts[1].trim();
            } else {
                data.location = locationDateText;
            }
        }

        // Get condition
        const condition = card.querySelector('span.css-iudov9');
        if (condition) {
            data.condition = condition.textContent.trim();
        }

        // Check if promoted
        const promotedBadge = card.querySelector('div.css-5jyke2 div.css-s3yjnp');
        if (promotedBadge) {
            data.promoted = true;
        }

        // Check if delivery is available
        const deliveryBadge = card.querySelector('div[data-testid="card-delivery-badge"]');
        if (deliveryBadge) {
            data.delivery = true;
        }

        // Get main image
        const img = card.querySelector('img.css-8wsg1m');
        if (img) {
            data.image = img.src;

            // Try to get higher quality from srcset
            if (img.srcset) {
                const srcset = img.srcset;
                const srcsetParts = srcset.split(',');
                if (srcsetParts.length > 0) {
                    const bestPart = srcsetParts[srcsetParts.length - 1].trim();
                    const src = bestPart.split(' ')[0];
                    if (src) data.image = src;
                }
            }

            // Add to images array
            data.images.push(data.image);
        }

        return data;
    };

    // Extract all images and description from a listing page
    const extractDetailedData = (html, basicData) => {
        const data = { ...basicData };

        // Create parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Get description
        const descriptionElement = doc.querySelector('div[data-cy="ad_description"] div');
        if (descriptionElement) {
            data.description = descriptionElement.innerHTML.trim();
        } else {
            data.description = '';
        }

        // Get images from swiper
        const swiper = doc.querySelector('.swiper-wrapper');
        if (swiper) {
            // Create a temporary array for new images
            const newImages = [];

            // Process swiper images first
            const slides = swiper.querySelectorAll('.swiper-slide');
            slides.forEach(slide => {
                const slideImg = slide.querySelector('img');
                if (slideImg) {
                    let imgSrc = slideImg.src;

                    // Try to get higher quality from srcset
                    if (slideImg.srcset) {
                        const srcset = slideImg.srcset;
                        const srcsetParts = srcset.split(',');
                        if (srcsetParts.length > 0) {
                            const bestPart = srcsetParts[srcsetParts.length - 1].trim();
                            const src = bestPart.split(' ')[0];
                            if (src) imgSrc = src;
                        }
                    }

                    // Add to images array if not already there and not a placeholder
                    if (imgSrc && !newImages.includes(imgSrc) && imgSrc !== PLACEHOLDER_IMAGE) {
                        newImages.push(imgSrc);
                    }
                }
            });

            // If we have the main image and it's not a placeholder, add it if not already in the array
            if (data.image && data.image !== PLACEHOLDER_IMAGE && !newImages.includes(data.image)) {
                newImages.unshift(data.image); // Add at the beginning
            }

            // Now update the data.images with our deduplicated list
            data.images = newImages;

            // If we don't have any real images, but we have a placeholder, keep that
            if (data.images.length === 0 && data.image) {
                data.images.push(data.image);
            }
        } else if (data.image) {
            // If no swiper but we have a main image, use it
            data.images = [data.image];
        }

        return data;
    };

    // Create a new card with our premium layout
    const createPremiumCard = (data) => {
        const card = document.createElement('div');
        card.className = 'olx-card';

        // If promoted, add attribute for filtering
        if (data.promoted) {
            card.setAttribute('data-olx-promoted', 'true');

            // Apply hide class if filter is on
            const settings = getSettings();
            if (settings.hidePromoted) {
                card.classList.add('olx-hide-promoted');
            }
        }

        // Determine which image to use as background
        let backgroundImage = data.image;

        // If the main image is a placeholder and we have other images, use the first non-placeholder
        if (backgroundImage === PLACEHOLDER_IMAGE && data.images && data.images.length > 0) {
            // Find first non-placeholder image
            for (let i = 0; i < data.images.length; i++) {
                if (data.images[i] !== PLACEHOLDER_IMAGE) {
                    backgroundImage = data.images[i];
                    break;
                }
            }
        }

        // Add background image
        if (backgroundImage) {
            card.innerHTML = `<img src="${backgroundImage}" class="olx-bg-image" alt="Background">`;
        }

        // Main content container
        const content = document.createElement('div');
        content.className = 'olx-content';

        // Top section: Tags, Title, Price, Date
        let html = '<div class="olx-top">';

        // Title section with tags
        html += '<div class="olx-title-section">';

        // Tags row
        html += '<div class="olx-tags">';
        if (data.condition) {
            html += `<span class="olx-tag olx-condition-tag">${data.condition}</span>`;
        }
        if (data.promoted) {
            html += `<span class="olx-tag olx-promoted-tag">Promoted</span>`;
        }
        if (data.delivery) {
            html += `
                <span class="olx-tag olx-delivery-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" fill-rule="evenodd" d="m2 4 1-1h10l2 2h3.5L22 9.667V17l-1 1h-2a3 3 0 1 1-6 0h-3a3 3 0 1 1-6 0H3l-1-1V4Z"/>
                    </svg>
                    Delivery
                </span>
            `;
        }
        html += '</div>'; // Close tags

        // Title
        html += `<div class="olx-title">${data.title || ''}</div>`;
        html += '</div>'; // Close title section

        // Price and date section
        html += '<div class="olx-price-section">';
        if (data.date) {
            html += `<div class="olx-date">${data.date}</div>`;
        }
        html += `<div class="olx-price">${data.price || ''}</div>`;
        html += '</div>'; // Close price section

        html += '</div>'; // Close top section

        // Always create the gallery, even with just one image
        if (data.images && data.images.length > 0) {
            html += '<div class="olx-gallery">';

            // Create an array of images for the gallery that doesn't include the background
            const galleryImages = data.images.filter(img => img !== backgroundImage);

            // If we filtered out all images (because they were the same as background),
            // just show the background image in the gallery too
            if (galleryImages.length === 0) {
                html += `<img src="${backgroundImage}" class="olx-thumb" alt="Image 1" data-index="0">`;
            } else {
                // Otherwise show all images except the background
                for (let idx = 0; idx < galleryImages.length; idx++) {
                    // Find the original index in the full images array for the data-index attribute
                    const originalIndex = data.images.indexOf(galleryImages[idx]);
                    html += `<img src="${galleryImages[idx]}" class="olx-thumb" alt="Image ${idx + 1}" data-index="${originalIndex}">`;
                }
            }

            html += '</div>';
        }

        // Description if available
        if (data.description) {
            // Estimate if description is short
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.description;
            const textLength = tempDiv.textContent.length;
            const isShort = textLength < 100;

            html += `<div class="olx-desc ${isShort ? 'short' : ''}">${data.description}</div>`;

            // Only add toggle if not short
            if (!isShort) {
                html += '<div class="olx-toggle">+ Show more</div>';
            }
        }

        // Bottom section with actions and location
        html += '<div class="olx-bottom">';

        // Action buttons
        html += '<div class="olx-actions">';
        html += `
            <button class="olx-follow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" fill-rule="evenodd" d="M20.219 10.367 12 20.419 3.806 10.4A3.96 3.96 0 0 1 3 8c0-2.206 1.795-4 4-4a4.004 4.004 0 0 1 3.868 3h2.264A4.003 4.003 0 0 1 17 4c2.206 0 4 1.794 4 4 0 .868-.279 1.698-.781 2.367M17 2a5.999 5.999 0 0 0-5 2.686A5.999 5.999 0 0 0 7 2C3.692 2 1 4.691 1 8a5.97 5.97 0 0 0 1.232 3.633L10.71 22h2.582l8.501-10.399A5.943 5.943 0 0 0 23 8c0-3.309-2.692-6-6-6"></path>
                </svg>
                <span>Последвай</span>
            </button>
            <a href="${data.url}" class="olx-original" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                </svg>
                View Original
            </a>
        `;
        html += '</div>'; // Close actions

        // Location with Google Maps link
        if (data.location) {
            const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(data.location)}`;
            html += `
                <a href="${mapsUrl}" class="olx-location" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    ${data.location}
                </a>
            `;
        }

        html += '</div>'; // Close bottom section

        content.innerHTML = html;
        card.appendChild(content);

        // Add event listeners

        // Thumbnail clicks
        const thumbs = card.querySelectorAll('.olx-thumb');
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                window.showOlxModal(data.images, index);
            });
        });

        // Background image click should show gallery
        const bgImage = card.querySelector('.olx-bg-image');
        if (bgImage && data.images && data.images.length > 0) {
            bgImage.addEventListener('click', () => {
                // Find the index of the background image in the images array
                const bgIndex = data.images.indexOf(backgroundImage);
                window.showOlxModal(data.images, bgIndex >= 0 ? bgIndex : 0);
            });
        }

        // Toggle description
        const desc = card.querySelector('.olx-desc:not(.short)');
        const toggle = card.querySelector('.olx-toggle');
        if (desc && toggle) {
            toggle.addEventListener('click', () => {
                if (desc.classList.contains('expanded')) {
                    desc.classList.remove('expanded');
                    toggle.textContent = '+ Show more';
                } else {
                    desc.classList.add('expanded');
                    toggle.textContent = '- Show less';
                }
            });
        }

        return card;
    };

    // Fetch additional data for a listing and update the card
    const fetchAndUpdateCard = (card, basicData) => {
        // Check if we already have this data cached
        if (dataCache[basicData.url]) {
            const fullData = dataCache[basicData.url];
            replaceCardContent(card, fullData);
            return;
        }

        // Make sure URL is absolute
        const fullUrl = basicData.url.startsWith('/') ? 'https://www.olx.bg' + basicData.url : basicData.url;

        // Create temporary content while loading
        replaceCardContent(card, basicData);

        // Fetch the listing page
        GM_xmlhttpRequest({
            method: 'GET',
            url: fullUrl,
            timeout: 10000,
            onload: (response) => {
                if (response.status === 200) {
                    try {
                        // Extract full data
                        const fullData = extractDetailedData(response.responseText, basicData);

                        // Cache the data
                        dataCache[basicData.url] = fullData;

                        // Update card with full data
                        replaceCardContent(card, fullData);
                    } catch (error) {
                        console.error('OLX Detail Error:', error);
                    }
                }
            },
            onerror: (error) => {
                console.error('OLX Fetch Error:', error);
            }
        });
    };

    // Replace a card's content with our premium layout
    const replaceCardContent = (card, data) => {
        // Create our custom card
        const premiumCard = createPremiumCard(data);

        // Replace all content in the original card
        card.innerHTML = '';

        // Copy all children from premium card to original card
        while (premiumCard.firstChild) {
            card.appendChild(premiumCard.firstChild);
        }

        // Copy relevant attributes from premium card
        if (premiumCard.hasAttribute('data-olx-promoted')) {
            card.setAttribute('data-olx-promoted', premiumCard.getAttribute('data-olx-promoted'));
        }

        if (premiumCard.classList.contains('olx-hide-promoted')) {
            card.classList.add('olx-hide-promoted');
        }

        // Copy class names
        card.className = `css-l9drzq ${premiumCard.className}`;

        // Mark as processed
        card.setAttribute('data-olx-processed', 'true');
        processedCards.add(card.id || Math.random().toString(36).substring(2, 9));
    };

    // Filter grid to only show cards with data-testid="l-card"
    const filterGrid = () => {
        const grid = document.querySelector('div[data-testid="listing-grid"]');
        if (!grid) return;

        // Get all direct children
        const children = Array.from(grid.children);

        // Remove any that don't have data-testid="l-card"
        children.forEach(child => {
            if (!child.matches('div[data-testid="l-card"]') &&
                !child.classList.contains('olx-loader')) {
                child.remove();
            }
        });
    };

    // Process all listing cards on the page
    const processCards = () => {
        const grid = document.querySelector('div[data-testid="listing-grid"]');
        if (!grid) return;

        // Filter grid first
        filterGrid();

        // Find all unprocessed cards
        const cards = grid.querySelectorAll('div[data-testid="l-card"]:not([data-olx-processed="true"])');

        cards.forEach(card => {
            // Skip if already processed
            if (processedCards.has(card.id || '')) return;

            // Extract basic data from the card
            const basicData = extractCardData(card);

            // Skip if no URL found
            if (!basicData.url) return;

            // Fetch additional data and update the card
            fetchAndUpdateCard(card, basicData);
        });
    };

    // Add promoted filter toggle
    const addFilterToggle = () => {
        // Find the pagination control area
        const filterArea = document.querySelector('div.css-k5itnz');
        if (!filterArea) return;

        // Load settings
        const settings = getSettings();

        // Create toggle element
        const filterToggle = document.createElement('div');
        filterToggle.className = 'olx-filter-control';
        filterToggle.innerHTML = `
            <label class="olx-switch">
                <input type="checkbox" id="olx-hide-promoted" ${settings.hidePromoted ? 'checked' : ''}>
                <span class="olx-slider"></span>
            </label>
            <span>Hide promoted listings</span>
        `;

        // Replace the "How are listings ordered?" link
        filterArea.innerHTML = '';
        filterArea.appendChild(filterToggle);

        // Add event listener for toggle
        const checkbox = filterToggle.querySelector('#olx-hide-promoted');
        checkbox.addEventListener('change', () => {
            // Update settings
            settings.hidePromoted = checkbox.checked;
            saveSettings(settings);

            // Update visibility of promoted cards
            const promotedCards = document.querySelectorAll('div[data-olx-promoted="true"]');
            promotedCards.forEach(card => {
                if (checkbox.checked) {
                    card.classList.add('olx-hide-promoted');
                } else {
                    card.classList.remove('olx-hide-promoted');
                }
            });
        });
    };

    // Function to detect the current page number and max page from pagination
    const detectPagination = () => {
        const pagination = document.querySelector('div[data-testid="pagination-wrapper"]');
        if (!pagination) return;

        // Find active page
        const activePage = pagination.querySelector('.pagination-item__active');
        if (activePage) {
            const pageLink = activePage.querySelector('a');
            if (pageLink) {
                const pageNum = parseInt(pageLink.textContent);
                if (!isNaN(pageNum)) {
                    currentPage = pageNum;
                }
            }
        }

        // Find last page
        const lastPageLink = pagination.querySelector('li:nth-last-child(2) a');
        if (lastPageLink) {
            const lastNum = parseInt(lastPageLink.textContent);
            if (!isNaN(lastNum)) {
                maxPage = lastNum;
            }
        }

        console.log(`OLX Pagination: Current page ${currentPage}, Max page ${maxPage}`);
    };

    // Infinite scroll - load next page
    const loadNextPage = () => {
        if (isLoadingMorePages || currentPage >= maxPage) return;

        // Mark as loading
        isLoadingMorePages = true;

        // Create loader element
        const loader = document.createElement('div');
        loader.className = 'olx-loader';
        loader.innerHTML = '<div class="olx-spinner"></div> Loading more listings...';

        // Add to page
        const grid = document.querySelector('div[data-testid="listing-grid"]');
        if (grid) {
            grid.appendChild(loader);
        }

        // Get next page URL
        const nextPage = currentPage + 1;

        // Check if already processed
        if (processedPages.has(nextPage)) {
            isLoadingMorePages = false;
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
            return;
        }

        // Build URL for next page
        let nextUrl = window.location.href;
        if (nextUrl.includes('page=')) {
            nextUrl = nextUrl.replace(/page=\d+/, `page=${nextPage}`);
        } else if (nextUrl.includes('?')) {
            nextUrl += `&page=${nextPage}`;
        } else {
            nextUrl += `?page=${nextPage}`;
        }

        // Fetch next page
        GM_xmlhttpRequest({
            method: 'GET',
            url: nextUrl,
            timeout: 15000,
            onload: (response) => {
                // Remove loader
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }

                if (response.status === 200) {
                    try {
                        // Parse HTML
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        // Get cards from next page
                        const nextPageCards = Array.from(doc.querySelectorAll('div[data-testid="l-card"]'));

                        // Process and add each card to current page
                        nextPageCards.forEach(nextPageCard => {
                            // Extract basic data
                            const basicData = extractCardData(nextPageCard);

                            // Skip if no URL
                            if (!basicData.url) return;

                            // Create a new card element
                            const newCard = document.createElement('div');
                            newCard.setAttribute('data-testid', 'l-card');
                            newCard.setAttribute('data-cy', 'l-card');
                            newCard.className = 'css-l9drzq';
                            newCard.id = 'card_' + Math.random().toString(36).substring(2, 9);

                            // Add to grid
                            if (grid) {
                                grid.appendChild(newCard);

                                // Fetch details and update
                                fetchAndUpdateCard(newCard, basicData);
                            }
                        });

                        // Mark page as processed
                        processedPages.add(nextPage);

                        // Update current page
                        currentPage = nextPage;

                        // Reset loading flag
                        isLoadingMorePages = false;

                    } catch (error) {
                        console.error('OLX Next Page Error:', error);
                        isLoadingMorePages = false;
                    }
                } else {
                    console.error('OLX Next Page Failed:', response.status);
                    isLoadingMorePages = false;
                }
            },
            onerror: (error) => {
                console.error('OLX Next Page Request Error:', error);
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
                isLoadingMorePages = false;
            }
        });
    };

    // Check scroll position and load more if needed
    const checkScroll = () => {
        if (isLoadingMorePages || currentPage >= maxPage) return;

        const scrollY = window.scrollY;
        const visibleHeight = window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const bottomOfPage = scrollY + visibleHeight >= pageHeight - 800; // Load earlier (800px before bottom)

        if (bottomOfPage) {
            loadNextPage();
        }
    };

    // Setup scroll detection
    const setupInfiniteScroll = () => {
        // Detect pagination first
        detectPagination();

        // Check scroll position periodically
        setInterval(checkScroll, 500);

        // Also check on scroll with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;

            scrollTimeout = setTimeout(() => {
                checkScroll();
                scrollTimeout = null;
            }, 200);
        }, { passive: true });
    };

    // Watch for changes in the DOM to process new cards and pagination
    const setupObserver = () => {
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            let checkPagination = false;
            let checkFilter = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check for listing cards
                            if (node.matches('div[data-testid="l-card"]') ||
                                node.querySelector('div[data-testid="l-card"]')) {
                                shouldProcess = true;
                            }

                            // Check for pagination
                            if (node.matches('div[data-testid="pagination-wrapper"]') ||
                                node.querySelector('div[data-testid="pagination-wrapper"]')) {
                                checkPagination = true;
                            }

                            // Check for filter area
                            if (node.matches('div.css-k5itnz') ||
                                node.querySelector('div.css-k5itnz')) {
                                checkFilter = true;
                            }
                        }
                    }
                }

                if (shouldProcess && checkPagination && checkFilter) break;
            }

            if (shouldProcess) {
                setTimeout(processCards, 100);
            }

            if (checkPagination) {
                setTimeout(detectPagination, 100);
            }

            if (checkFilter) {
                setTimeout(addFilterToggle, 100);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Initialize script
    const init = () => {
        // Add styles
        addStyles();

        // Setup image modal
        setupImageModal();

        // Add filter toggle
        setTimeout(addFilterToggle, 1000);

        // Process cards
        setTimeout(processCards, 1000);

        // Setup infinite scroll
        setTimeout(setupInfiniteScroll, 1500);

        // Setup observer
        setupObserver();

        // Periodic card processing and filtering
        setInterval(() => {
            processCards();
            filterGrid();
        }, 2000);

        // Handle URL changes (SPA navigation)
        let lastUrl = location.href;
        setInterval(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;

                // Reset page tracking
                currentPage = 1;
                maxPage = 1;
                processedPages.clear();
                processedCards.clear();

                // Detect pagination and process cards after a delay
                setTimeout(() => {
                    detectPagination();
                    addFilterToggle();
                    processCards();
                }, 1000);
            }
        }, 1000);
    };

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();