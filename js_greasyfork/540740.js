// ==UserScript==
// @name         IPTorrents Thread Image Preview
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Preview images from IPTorrents thread on hover
// @author       SH3LL
// @match        https://iptorrents.com/t*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540740/IPTorrents%20Thread%20Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/540740/IPTorrents%20Thread%20Image%20Preview.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create tooltip container
    const tooltip = document.createElement('div');
    Object.assign(tooltip.style, {
        position: 'absolute',
        padding: '4px',
        background: '#111',
        border: '1px solid #444',
        borderRadius: '3px',
        boxShadow: '0 0 6px rgba(0,0,0,0.7)',
        zIndex: 9999,
        display: 'none',
        width: 'fit-content', // Shrink to fit the content's natural width
        height: 'fit-content' // Shrink to fit the content's natural height
    });
    document.body.appendChild(tooltip);

    // Cache to avoid repeated fetches
    const cache = {};

    // Extract all images from thread HTML
    function extractImage(htmlText) {
        const tmp = document.createElement('div');
        tmp.innerHTML = htmlText;
        const imageSources = [];

        // Try original selector
        let images = tmp.querySelectorAll('blockquote .zoomWarp img');
        images.forEach(img => {
            if (img.src) {
                imageSources.push(img.src);
            }
        });

        // Try alternative selector for lazy-loading
        images = tmp.querySelectorAll('blockquote .zoomWarp img[data-src]');
        images.forEach(img => {
            if (img.dataset.src) {
                imageSources.push(img.dataset.src);
            }
        });

        // Try more generic selector
        images = tmp.querySelectorAll('blockquote img');
        images.forEach(img => {
            if (img.src || img.dataset.src) {
                imageSources.push(img.src || img.dataset.src);
            }
        });

        // Remove duplicates while preserving order
        const uniqueSources = [...new Set(imageSources)];

        return uniqueSources.length > 0 ? uniqueSources : null;
    }

    // Show tooltip with all images
    function showTooltip(x, y, content) {
        tooltip.innerHTML = '';
        if (Array.isArray(content)) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.gap = '4px';
            container.style.width = 'fit-content'; // Ensure container shrinks to wrapped content

            // Set max-width to accommodate exactly two images per row (400px each + 4px gap)
            const imagesPerRow = 2;
            const imageWidth = 400;
            const gap = 4;
            const constrainedWidth = imagesPerRow * (imageWidth + gap) - gap; // Subtract gap for last image in row
            container.style.maxWidth = `${constrainedWidth}px`; // Limit container width to two images

            content.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.style.maxWidth = `${imageWidth}px`;
                img.style.maxHeight = '400px';
                img.style.display = 'block'; // Prevent inline spacing issues
                img.style.flex = `0 0 calc(50% - ${gap / 2}px)`; // Each image takes half the container width minus half the gap
                img.onerror = () => { img.alt = 'Failed to load image'; };
                container.appendChild(img);

                // Add line break after every second image
                if ((index + 1) % imagesPerRow === 0 && index < content.length - 1) {
                    const lineBreak = document.createElement('div');
                    lineBreak.style.width = '100%'; // Force line break
                    container.appendChild(lineBreak);
                }
            });
            tooltip.appendChild(container);

            // Force reflow to ensure correct width after wrapping
            tooltip.style.display = 'inline-block';
            container.offsetWidth; // Trigger reflow
        } else {
            tooltip.innerHTML = content;
        }

        // Measure tooltip size after content is added
        tooltip.style.display = 'inline-block';
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;

        // Adjust position to prevent overflow
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let adjustedX = x + 12;
        let adjustedY = y + 12;

        // If tooltip would overflow right edge, move it left
        if (adjustedX + tooltipWidth > viewportWidth - 10) {
            adjustedX = x - tooltipWidth - 12;
        }
        // If tooltip would overflow bottom edge, move it up
        if (adjustedY + tooltipHeight > viewportHeight - 10) {
            adjustedY = y - tooltipHeight - 12;
        }

        // Ensure tooltip doesn't go off-screen on left or top
        adjustedX = Math.max(10, adjustedX);
        adjustedY = Math.max(10, adjustedY);

        tooltip.style.left = adjustedX + 'px';
        tooltip.style.top = adjustedY + 'px';
    }

    // Hide tooltip
    function hideTooltip() {
        tooltip.style.display = 'none';
        tooltip.innerHTML = '';
    }

    // Handle mouseover and mousemove events
    async function onLinkHover(e) {
        const a = e.currentTarget;
        const threadUrl = a.href;
        const mx = e.pageX, my = e.pageY;

        // Check cache
        if (cache.hasOwnProperty(threadUrl)) {
            console.log('Loaded from cache:', threadUrl);
            const imgSources = cache[threadUrl];
            if (imgSources) {
                showTooltip(mx, my, imgSources);
            } else {
                showTooltip(mx, my, 'No preview available');
            }
            return;
        }

        // Mark as in progress
        cache[threadUrl] = null;

        try {
            console.log('Fetching:', threadUrl);
            const res = await fetch(threadUrl, {
                credentials: 'include',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const text = await res.text();
            const imgSources = extractImage(text);
            cache[threadUrl] = imgSources;

            if (imgSources) {
                showTooltip(mx, my, imgSources);
            } else {
                showTooltip(mx, my, 'No preview available');
            }
        } catch (err) {
            cache[threadUrl] = null;
            showTooltip(mx, my, 'Error loading preview');
        }
    }

    // Handle mouseout event
    function onLinkOut() {
        hideTooltip();
    }

    // Attach events to thread links
    function attachToLinks() {
        const links = document.querySelectorAll('td.al a[href^="/t/"]');
        links.forEach(a => {
            if (!a.dataset.previewBound) {
                a.addEventListener('mouseover', onLinkHover);
                a.addEventListener('mousemove', onLinkHover);
                a.addEventListener('mouseout', onLinkOut);
                a.dataset.previewBound = '1';
            }
        });
    }

    // Run on load
    attachToLinks();

    // Observe for dynamic content
    const obs = new MutationObserver(attachToLinks);
    obs.observe(document.body, { childList: true, subtree: true });
})();