// ==UserScript==
// @name         SubDL Image Preview
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Display image previews on subdl.com .
// @author       dr.bobo0
// @match        https://subdl.com/u/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAgCAMAAADdXFNzAAAAXVBMVEVHcEz/7ir/7ir/7ir/7ir/7ir/7ir/7in/7ir/7ir/7ir/7ir/7Sr/7ir/7ir/7ir/9Sn/8iopKjMxMTMdIDMKEDSDfDBkXzH/+inBtS3bzSzSxC1GRDLs3SuZkC8BXe1rAAAAD3RSTlMAmpG5qyvRFvBGY9wGycP/EwDKAAABG0lEQVQokX2Ti5KDIAxFUSmgtg1P6/v/P3NFB0y03TvjjPFAIjeEsSzZ8FaBankj2V21gFOivtDnG6jeT4wfcNcD5f6CAer/duMMPzDAgXmOtYnSJsWcZl982DXmBbFClXd31lm7PR+dPlW4euRd12G+/UGDue11PwfEG1Zg7hdjpumsDwUTmLvZwHaC84SCqfxuxrDV7okDCpujh+D8ShcQ8/rVuzBowhWO9Me6sKD6ir1IOpidcyh8sZJgs3jiT4l7r7UGM3nMa+qv1aafqb9neyMfpxHz2GCJuPPeO3fy/aKnDpgh+KiwJl4cFyhZYKZhV8IqDU4+3SGS/fcFRgMg1Y0qOoTFBRfX+ZQcUf5tglldVqIVVYmH9w/WzDC9Fj6LqQAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519119/SubDL%20Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/519119/SubDL%20Image%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("UserScript started.");

    const storagePrefix = "subdl_image_cache_";
    const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    const exclusionList = [
        '/', // Home
        '/panel',
        '/panel/my-subtitles',
        '/panel/account',
        '/panel/api',
        '/latest',
        '/popular',
        'https://t.me/subdl_com', // External link
        '/ads', // Advertise link
        '/api-doc', // API documentation
        '/panel/logout',
        '/login', // Login page
        '#', // Placeholder links like Privacy Policy
        '/signup' // Signup page
    ];

    function clearOldCache() {
        console.log("Clearing old cache entries.");
        const now = Date.now();
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(storagePrefix)) {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    if (now - item.timestamp > maxCacheAge) {
                        localStorage.removeItem(key);
                        console.log(`Removed old cache entry: ${key}`);
                    }
                } catch (e) {
                    console.error(`Error parsing cache item: ${key}`, e);
                    localStorage.removeItem(key);
                }
            }
        }
    }

    function addPreviewToLinks() {
        console.log("Adding preview to links.");
        const links = document.querySelectorAll('a[href*="/s/info/"]');
        let linksFound = 0;

        links.forEach(link => {
            if (shouldAddPreview(link)) {
                linksFound++;
                if (!link.dataset.hasEventListener) {
                    console.log("Adding event listener to link:", link.href);
                    link.dataset.hasEventListener = 'true';

                    link.addEventListener("mouseover", function() {
                        console.log("Mouseover event triggered for link:", this.href);
                        let previewContainer = createPreviewContainer();

                        document.body.appendChild(previewContainer);
                        showLoadingSpinner(previewContainer);
                        fetchImage(this.href, previewContainer);

                        let removeMousemoveListener = addMousemoveListener(previewContainer);
                        handleMouseout(link, previewContainer, removeMousemoveListener);
                        handleClick(link, previewContainer, removeMousemoveListener);
                    });
                } else {
                    console.log("Event listener already added for link:", link.href);
                }
            }
        });

        if (linksFound === 0) {
            console.warn("No suitable links found.");
        }
    }

    function shouldAddPreview(link) {
        const href = link.href;

        // Check if the link is in the exclusion list
        for (const exclusion of exclusionList) {
            if (href.endsWith(exclusion)) {
                return false;
            }
        }

        const pattern = /subdl.com/; // General pattern to match subdl.com links
        return pattern.test(href);
    }

    function createPreviewContainer() {
        console.log("Creating preview container.");
        let previewContainer = document.createElement("div");
        Object.assign(previewContainer.style, {
            position: "fixed",
            display: "none",
            transition: "opacity 0.1s ease-in-out",
            opacity: 0,
            width: "154px",
            height: "231px",
            overflow: "hidden",
            zIndex: 1000,
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            backgroundColor: "#ffffff"
        });
        console.log("Preview container created:", previewContainer);
        return previewContainer;
    }

    function showLoadingSpinner(previewContainer) {
        console.log("Showing loading spinner.");
        previewContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #f0f0f0;">
                <div style="width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #999; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        previewContainer.style.display = "block";
        previewContainer.style.opacity = 1;
    }

    function fetchImage(url, previewContainer) {
        console.log("Fetching image for URL:", url);
        const cacheKey = storagePrefix + url;
        let cachedImage = localStorage.getItem(cacheKey);

        if (cachedImage) {
            try {
                const parsedCache = JSON.parse(cachedImage);
                if (Date.now() - parsedCache.timestamp < maxCacheAge) {
                    console.log(`Image found in cache for ${url}`);
                    setImage(previewContainer, parsedCache.src);
                    return;
                } else {
                    console.log(`Cached image for ${url} is too old, fetching new one`);
                    localStorage.removeItem(cacheKey);
                }
            } catch (e) {
                console.error(`Error parsing cached image for ${url}`, e);
                localStorage.removeItem(cacheKey);
            }
        }

        console.log(`Image not in cache, fetching from network for ${url}`);
        fetch(url)
            .then(response => response.text())
            .then(html => {
                console.log("Fetched HTML for URL:", url);
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let preview = doc.querySelector("div.select-none img"); // New image selector
                if (preview) {
                    let src = preview.getAttribute("src");
                    console.log(`Image fetched successfully for ${url}`);
                    setImage(previewContainer, src);
                    try {
                        localStorage.setItem(cacheKey, JSON.stringify({
                            src: src,
                            timestamp: Date.now()
                        }));
                    } catch (e) {
                        console.error(`Failed to cache image for ${url}:`, e);
                        clearOldCache(); // Attempt to free up space
                    }
                } else {
                    console.log(`Image not found in the fetched HTML for ${url}`);
                    setError(previewContainer, "Image not found.");
                }
            })
            .catch(error => {
                console.error(`Failed to fetch image for ${url}: ${error}`);
                setError(previewContainer, "Failed to load image.");
            });
    }

    function setImage(previewContainer, src) {
        console.log("Setting image for preview container:", src);
        previewContainer.innerHTML = `<img style="width: 100%; height: 100%; object-fit: cover;" src="${src}"/>`;
        previewContainer.style.display = "block";
        previewContainer.style.opacity = 1;
        console.log("Image displayed in preview container.");
    }

    function setError(previewContainer, message) {
        console.log("Setting error message for preview container:", message);
        previewContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; color: red; font-weight: bold; text-align: center;">
                ${message}
            </div>
        `;
        previewContainer.style.display = "block";
        previewContainer.style.opacity = 1;
        console.log("Error message displayed in preview container.");
    }

    function addMousemoveListener(previewContainer) {
        console.log("Adding mousemove listener for preview container.");
        function movePreview(event) {
            previewContainer.style.top = event.clientY + 20 + "px";
            previewContainer.style.left = event.clientX + 20 + "px";

            if (event.clientX + previewContainer.offsetWidth + 20 > window.innerWidth) {
                previewContainer.style.left = window.innerWidth - previewContainer.offsetWidth - 20 + "px";
            }
            if (event.clientY + previewContainer.offsetHeight + 20 > window.innerHeight) {
                previewContainer.style.top = window.innerHeight - previewContainer.offsetHeight - 20 + "px";
            }
        }

        document.addEventListener("mousemove", movePreview);
        console.log("Mousemove listener added.");

        return () => {
            document.removeEventListener("mousemove", movePreview);
            console.log("Mousemove listener removed.");
        };
    }

    function handleMouseout(link, previewContainer, removeMousemoveListener) {
        console.log("Adding mouseout listener for link:", link.href);
        link.addEventListener("mouseout", function() {
            console.log("Mouseout event triggered for link:", link.href);
            cleanupPreview(previewContainer, removeMousemoveListener);
        });
    }

    function handleClick(link, previewContainer, removeMousemoveListener) {
        console.log("Adding click listener for link:", link.href);
        link.addEventListener("click", function() {
            console.log("Click event triggered for link:", link.href);
            cleanupPreview(previewContainer, removeMousemoveListener);
        });
    }

    function cleanupPreview(previewContainer, removeMousemoveListener) {
        previewContainer.style.opacity = 0;
        setTimeout(() => {
            previewContainer.style.display = "none";
            previewContainer.remove();
            removeMousemoveListener();
            console.log("Preview container removed.");
        }, 200);
    }

    // Clear old cache entries and set up the DOM mutation observer
    clearOldCache();
    addPreviewToLinks();

    const observer = new MutationObserver(() => {
        console.log("DOM mutation detected, adding preview to new links.");
        addPreviewToLinks();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
