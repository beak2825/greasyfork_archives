// ==UserScript==
// @name         Danbooru Enchanced Gallery
// @namespace    https://github.com/yourusername/danbooru-justified-gallery
// @version      1.54
// @description  Overhauls Danbooru's default gallery view with a sleek, responsive justified grid layout. Includes high-res thumbnails, hover previews, overlay actions, and more.
// @author       Claude Sonnet 4 (prompted by orx_ibx)
// @match        https://danbooru.donmai.us/
// @match        https://danbooru.donmai.us/posts*
// @match        https://danbooru.donmai.us/?tags=*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/justifiedGallery/3.8.1/js/jquery.justifiedGallery.min.js
// @resource     https://cdnjs.cloudflare.com/ajax/libs/justifiedGallery/3.8.1/css/justifiedGallery.min.css
// @license      MIT (https://opensource.org/licenses/MIT)
// @downloadURL https://update.greasyfork.org/scripts/543096/Danbooru%20Enchanced%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/543096/Danbooru%20Enchanced%20Gallery.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Config for added features
    const CONFIG = {
        // toggle features
        enableHoverPreview: true,
        enableHighRes: true,
        enableRelocateSearchBar: true,
        enableHiddenSidebar: true,

        // High rez thumbnail loader config
        viewportBuffer: 600, // pixels below viewport to start loading HR thumbs
        maxRetries: 0, // retry attempts for failed HR loads
        batchSize: 5, // num of HR thumbnails to load at once
        batchDelay: 0, // delay between each HR batch load
        enableScrollPause: true,
        scrollThrottleDelay: 0, // Add this line (ms to wait after scroll stops)

        // Hover preview config
        hoverDelay: 300, // ms delay before showing preview
    };

    // Config for Justified Gallery
    const JG_CONFIG = {
        rowHeight: 240,
        maxRowHeight: 1080,
        lastRow: "nojustify",
        margins: 8,
        border: 0,
        captions: true,
        randomize: false,
        waitThumbnailsLoad: true,
        cssAnimation: false,
        imagesAnimationDuration: 0,
        captionSettings: {
            animationDuration: 0,
            visibleOpacity: 0.5,
            nonVisibleOpacity: 0.0,
        },
    };

    // Elements that trigger a Justified Gallery reset when clicked
    // Add CSS selectors for any buttons or toggles that should reset JG on interaction
    const JG_RESET_SELECTORS = ["#jg-reload-btn"];

    class ImageManager {
        constructor() {
            this.urlCache = new Map();
            this.loadingCache = new Set();
            this.abortController = null;
            this.batchQueue = [];
            this.processingBatch = false;
            this.currentPreview = null;
            this.hoverContainer = null;
            this.previewAbortController = null;
            this.isScrolling = false; // Add this line
            this.scrollTimeout = null; // Add this line
            this.activeLoaders = new Map(); // Add this line (track active image loaders)

            if (CONFIG.enableHoverPreview) this.createHoverContainer();

            if (CONFIG.enableScrollPause) this.setupScrollDetection();
        }

        // Get the current zoom level
        getZoomLevel() {
            return window.devicePixelRatio || 1;
        }

        // Get zoom-independent dimensions
        getZoomIndependentDimensions() {
            const zoom = this.getZoomLevel();
            return {
                windowWidth: window.innerWidth * zoom,
                windowHeight: window.innerHeight * zoom,
                maxWidth: window.innerWidth * 0.95 * zoom,
                maxHeight: window.innerHeight * 0.95 * zoom,
            };
        }

        createHoverContainer() {
            this.hoverContainer = document.createElement("div");
            this.hoverContainer.id = "danbooru-hover-preview";
            document.body.appendChild(this.hoverContainer);
        }

        showPreview(imageUrl, mouseEvent) {
            if (!imageUrl || !this.hoverContainer) return;

            const img = document.createElement("img");
            img.src = imageUrl;
            img.onerror = () => {
                this.hidePreview();
            };

            // Apply zoom compensation when image loads
            img.onload = () => {
                this.applyZoomCompensation(img);
                // Reposition after zoom compensation is applied
                this.positionPreview(mouseEvent);
            };

            this.hoverContainer.innerHTML = "";
            this.hoverContainer.appendChild(img);

            // Position the preview
            this.positionPreview(mouseEvent);

            // Show with fade-in effect
            this.hoverContainer.classList.add("visible");
            this.currentPreview = img;
        }

        applyZoomCompensation(img) {
            const zoom = this.getZoomLevel();
            const zoomIndependent = this.getZoomIndependentDimensions();

            // Calculate the scale factor to counteract zoom
            const scaleCompensation = 1 / zoom;

            // Get natural image dimensions
            const naturalWidth = img.naturalWidth;
            const naturalHeight = img.naturalHeight;

            // Calculate how much we need to scale down to fit in viewport
            const widthScale = zoomIndependent.maxWidth / naturalWidth;
            const heightScale = zoomIndependent.maxHeight / naturalHeight;
            const fitScale = Math.min(widthScale, heightScale, 1); // Don't scale up

            // Apply both zoom compensation and fit scaling
            const finalScale = scaleCompensation * fitScale;

            // Set the transform to counteract zoom and fit to screen
            img.style.transform = `scale(${finalScale})`;
            img.style.transformOrigin = "top left";

            // Set dimensions based on the scaled size
            img.style.width = `${naturalWidth}px`;
            img.style.height = `${naturalHeight}px`;

            // Update the container to match the effective size
            this.hoverContainer.style.width = `${naturalWidth * finalScale}px`;
            this.hoverContainer.style.height = `${
                naturalHeight * finalScale
            }px`;
        }

        positionPreview(mouseEvent) {
            if (!this.hoverContainer) return;

            const zoom = this.getZoomLevel();
            const { clientX: mouseX, clientY: mouseY } = mouseEvent;
            const zoomIndependent = this.getZoomIndependentDimensions();

            // Adjust mouse coordinates for zoom
            const adjustedMouseX = mouseX * zoom;
            const adjustedMouseY = mouseY * zoom;

            // Temporarily position at mouse location to get accurate dimensions
            this.hoverContainer.style.left = `${adjustedMouseX / zoom}px`;
            this.hoverContainer.style.top = `${adjustedMouseY / zoom}px`;
            this.hoverContainer.style.visibility = "hidden";
            this.hoverContainer.style.display = "block";

            // Force layout recalculation
            this.hoverContainer.offsetHeight;

            // Get the effective size of the container
            const containerWidth =
                parseFloat(this.hoverContainer.style.width) ||
                this.hoverContainer.offsetWidth;
            const containerHeight =
                parseFloat(this.hoverContainer.style.height) ||
                this.hoverContainer.offsetHeight;

            // Calculate position in zoom-adjusted coordinates
            let left = (adjustedMouseX + 15) / zoom;
            let top = (adjustedMouseY + 15) / zoom;

            // Check boundaries and adjust
            if (
                left * zoom + containerWidth * zoom >
                zoomIndependent.windowWidth
            ) {
                left = (adjustedMouseX - containerWidth * zoom - 15) / zoom;
            }

            if (
                top * zoom + containerHeight * zoom >
                zoomIndependent.windowHeight
            ) {
                top = (adjustedMouseY - containerHeight * zoom - 15) / zoom;
            }

            // Ensure preview stays within viewport
            left = Math.max(
                10 / zoom,
                Math.min(
                    left,
                    (zoomIndependent.windowWidth - containerWidth * zoom - 10) /
                        zoom
                )
            );
            top = Math.max(
                10 / zoom,
                Math.min(
                    top,
                    (zoomIndependent.windowHeight -
                        containerHeight * zoom -
                        10) /
                        zoom
                )
            );

            // Apply final position and make visible
            this.hoverContainer.style.left = `${left}px`;
            this.hoverContainer.style.top = `${top}px`;
            this.hoverContainer.style.visibility = "visible";
        }

        hidePreview() {
            if (!this.hoverContainer) return;

            this.hoverContainer.classList.remove("visible");
            this.currentPreview = null;

            // Cancel any pending preview request
            if (this.previewAbortController) {
                this.previewAbortController.abort();
                this.previewAbortController = null;
            }

            // Clear content after fade-out
            setTimeout(() => {
                this.hoverContainer.innerHTML = "";
                // Reset container dimensions
                this.hoverContainer.style.width = "";
                this.hoverContainer.style.height = "";
            }, 200);
        }

        async fetchImageUrlForPreview(postId) {
            if (this.urlCache.has(postId)) {
                return this.urlCache.get(postId);
            }

            try {
                // Cancel any previous preview request
                if (this.previewAbortController) {
                    this.previewAbortController.abort();
                }

                this.previewAbortController = new AbortController();

                const response = await fetch(
                    `https://danbooru.donmai.us/posts/${postId}.json`,
                    {
                        signal: this.previewAbortController.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}: ${response.statusText}`
                    );
                }

                const data = await response.json();
                const imageUrl = data.large_file_url || data.file_url;

                if (imageUrl) {
                    this.urlCache.set(postId, imageUrl);
                    return imageUrl;
                }

                throw new Error("No image URL found in response");
            } catch (error) {
                if (error.name === "AbortError") {
                    return null; // Request was cancelled
                }
                // console.warn(
                //     `Failed to fetch preview image for post ${postId}:`,
                //     error
                // );
                return null;
            }
        }

        // Add to ImageManager class
        setupScrollDetection() {
            const handleScroll = () => {
                this.isScrolling = true;

                // Clear existing timeout
                if (this.scrollTimeout) {
                    clearTimeout(this.scrollTimeout);
                }

                // Set new timeout
                this.scrollTimeout = setTimeout(() => {
                    this.isScrolling = false;
                    // Resume batch processing if queue has items
                    if (this.batchQueue.length > 0) {
                        this.processBatch();
                    }
                }, CONFIG.scrollThrottleDelay);
            };

            window.addEventListener("scroll", handleScroll, { passive: true });
            window.addEventListener("wheel", handleScroll, { passive: true });
            window.addEventListener("touchmove", handleScroll, {
                passive: true,
            });
        }

        // Add this method to the class
        async processBatch() {
            if (this.processingBatch || this.batchQueue.length === 0) return;

            // Skip processing if scrolling and scroll pause is enabled
            if (CONFIG.enableScrollPause && this.isScrolling) return;

            this.processingBatch = true;
            const batch = this.batchQueue.splice(0, CONFIG.batchSize);

            await Promise.all(
                batch.map(({ img, postId }) =>
                    loadHighResImage(img, postId, this)
                )
            );

            this.processingBatch = false;

            // Process next batch if queue isn't empty and not scrolling
            if (
                this.batchQueue.length > 0 &&
                (!CONFIG.enableScrollPause || !this.isScrolling)
            ) {
                setTimeout(() => this.processBatch(), CONFIG.batchDelay);
            }
        }

        abortImageLoading(postId) {
            if (this.activeLoaders.has(postId)) {
                const controller = this.activeLoaders.get(postId);
                controller.abort();
                this.activeLoaders.delete(postId);
                this.loadingCache.delete(postId);
            }
        }

        async fetchImageUrl(postId) {
            if (this.urlCache.has(postId)) {
                return this.urlCache.get(postId);
            }

            if (this.loadingCache.has(postId)) {
                return null; // Already loading
            }

            this.loadingCache.add(postId);

            try {
                // Create controller for this specific request
                const controller = new AbortController();
                this.activeLoaders.set(postId, controller);

                const response = await fetch(
                    `https://danbooru.donmai.us/posts/${postId}.json`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}: ${response.statusText}`
                    );
                }

                const data = await response.json();
                const imageUrl = data.large_file_url || data.file_url;

                if (imageUrl) {
                    this.urlCache.set(postId, imageUrl);
                    return imageUrl;
                }

                throw new Error("No image URL found in response");
            } catch (error) {
                // if (error.name === "AbortError") {
                //     return null; // Request was cancelled
                // }
                // console.warn(
                //     `Failed to fetch image for post ${postId}:`,
                //     error
                // );
                // return null;
            } finally {
                this.loadingCache.delete(postId);
                this.activeLoaders.delete(postId);
            }
        }
    }

    function createIntersectionObserver(imageManager) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const img = entry.target;
                    const link = img.closest("a");

                    if (entry.isIntersecting) {
                        // Image entered viewport
                        if (link && !img.dataset.highResLoaded) {
                            const postId = extractPostIdFromUrl(link.href);
                            if (postId) {
                                // Remove from queue if it was there (in case it was added before)
                                imageManager.batchQueue =
                                    imageManager.batchQueue.filter(
                                        (item) => item.postId !== postId
                                    );

                                // Add to batch queue
                                imageManager.batchQueue.push({ img, postId });
                                imageManager.processBatch();
                            }
                        }
                    } else {
                        // Image left viewport - abort loading if in progress
                        if (link) {
                            const postId = extractPostIdFromUrl(link.href);
                            if (postId) {
                                // Remove from queue if it's there
                                imageManager.batchQueue =
                                    imageManager.batchQueue.filter(
                                        (item) => item.postId !== postId
                                    );

                                // Abort active loading
                                imageManager.abortImageLoading(postId);
                            }
                        }
                    }
                });
            },
            {
                // rootMargin: `${CONFIG.viewportBuffer}px`, // preload all side
                rootMargin: `0px 0px ${CONFIG.viewportBuffer}px 0px`, // preload only bottom
                threshold: 0.1,
            }
        );

        return observer;
    }

    function extractPostIdFromUrl(url) {
        const match = url.match(/\/posts\/(\d+)/);
        return match ? match[1] : null;
    }

    async function loadHighResImage(img, postId, imageManager) {
        if (
            img.dataset.highResLoaded === "true" ||
            img.dataset.highResLoading === "true"
        ) {
            return;
        }

        img.dataset.highResLoading = "true";

        try {
            const highResUrl = await imageManager.fetchImageUrl(postId);

            if (highResUrl && highResUrl !== img.src) {
                await replaceImageSrc(img, highResUrl);
                img.dataset.highResLoaded = "true";
            }
        } catch (error) {
            // console.warn(
            //     `Failed to load high-res image for post ${postId}:`,
            //     error
            // );
        } finally {
            img.dataset.highResLoading = "false";
        }
    }

    function replaceImageSrc(img, newSrc) {
        return new Promise((resolve, reject) => {
            const tempImg = new Image();

            tempImg.onload = () => {
                // Store original dimensions to maintain layout
                const originalWidth = img.offsetWidth;
                const originalHeight = img.offsetHeight;

                img.src = newSrc;

                // Ensure size doesn't change
                img.style.width = originalWidth + "px";
                img.style.height = originalHeight + "px";
                img.style.objectFit = "cover";

                resolve();
            };

            tempImg.onerror = () => {
                reject(new Error("Failed to load high-res image"));
            };

            tempImg.src = newSrc;
        });
    }

    function cleanup() {
        const justifiedContainer = document.getElementById(
            "justified-gallery-container"
        );
        if (justifiedContainer) {
            // Disconnect observer
            if (justifiedContainer.intersectionObserver) {
                justifiedContainer.intersectionObserver.disconnect();
            }

            // Clear caches
            if (justifiedContainer.imageManager) {
                // Abort all active loaders
                justifiedContainer.imageManager.activeLoaders.forEach(
                    (controller, postId) => {
                        controller.abort();
                    }
                );

                justifiedContainer.imageManager.urlCache.clear();
                justifiedContainer.imageManager.loadingCache.clear();
                justifiedContainer.imageManager.batchQueue = [];
                justifiedContainer.imageManager.processingBatch = false;
                justifiedContainer.imageManager.activeLoaders.clear();

                // Clear scroll timeout
                if (justifiedContainer.imageManager.scrollTimeout) {
                    clearTimeout(justifiedContainer.imageManager.scrollTimeout);
                }

                // Clean up hover preview
                if (justifiedContainer.imageManager.hoverContainer) {
                    justifiedContainer.imageManager.hidePreview();
                    justifiedContainer.imageManager.hoverContainer.remove();
                }
                if (justifiedContainer.imageManager.previewAbortController) {
                    justifiedContainer.imageManager.previewAbortController.abort();
                }
            }

            const existingButton = document.getElementById(
                "preview-toggle-button"
            );
            if (existingButton) {
                existingButton.remove();
            }

            // Remove toggle button
            if (justifiedContainer.toggleButton) {
                justifiedContainer.toggleButton.remove();
            }

            // Destroy the justified gallery instance
            $(justifiedContainer).justifiedGallery("destroy");

            // Remove the container entirely
            justifiedContainer.remove();

            // Also remove any stray toggle button
        }
    }

    // Separate event handler function
    async function handleCaptionClick(e) {
        e.preventDefault();
        // Prevent multiple clicks
        if (e.target.classList.contains("processing")) return;
        const isFavBtn = e.target.classList.contains("favorite-btn");
        const isFavorited = e.target.classList.contains("favorited");

        const isUpvBtn = e.target.classList.contains("upvote-btn");
        const isUpvoted = e.target.classList.contains("upvoted");

        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
        if (!csrfToken) {
            console.warn("CSRF token not found");
            return;
        }

        if (isUpvBtn) {
            e.preventDefault();
            e.stopPropagation();

            const postId = e.target.getAttribute("data-post-id");
            const scoreElement = e.target.nextElementSibling;

            // Prevent multiple clicks
            e.target.classList.add("processing");

            try {
                const rMethod = !isUpvoted ? "POST" : "DELETE";
                const rURL = `/posts/${postId}/votes`;
                const response = await fetch(rURL, {
                    method: rMethod,
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": csrfToken,
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify({ score: 1 }),
                });

                if (response.ok) {
                    // Only increment by 1, don't use server response
                    let currentScore = parseInt(scoreElement.textContent) || 0;
                    if (!isUpvoted) {
                        e.target.classList.add("upvoted");
                        scoreElement.textContent = currentScore + 1;
                        if (
                            scoreElement.classList.contains("neutral") &&
                            parseInt(scoreElement.textContent) > 0
                        ) {
                            scoreElement.classList.remove("neutral");
                            scoreElement.classList.add("positive");
                        }
                        e.target.classList.add("active");
                    } else {
                        e.target.classList.remove("upvoted");
                        scoreElement.textContent = currentScore - 1;
                        if (
                            scoreElement.classList.contains("positive") &&
                            parseInt(scoreElement.textContent) === 0
                        ) {
                            scoreElement.classList.remove("positive");
                            scoreElement.classList.add("neutral");
                        }
                        e.target.classList.remove("active");
                    }
                }
            } catch (error) {
                console.error("Error voting:", error);
            } finally {
                e.target.classList.remove("processing");
            }
        }

        // FAVORITE BUTTON
        if (isFavBtn) {
            e.preventDefault();
            e.stopPropagation();

            const postId = e.target.getAttribute("data-post-id");

            // Prevent multiple clicks
            e.target.classList.add("processing");

            try {
                const rMethod = !isFavorited ? "POST" : "DELETE";
                const rURL = !isFavorited
                    ? "/favorites.json"
                    : `/favorites/${postId}.json`;
                const response = await fetch(rURL, {
                    method: rMethod,
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": csrfToken,
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    body: JSON.stringify({ post_id: postId }),
                });

                if (response.ok) {
                    if (!isFavorited) {
                        e.target.classList.add("active");
                        e.target.classList.add("favorited");
                    } else {
                        e.target.classList.remove("active");
                        e.target.classList.remove("favorited");
                    }
                }
            } catch (error) {
                console.error("Error favoriting:", error);
            } finally {
                e.target.classList.remove("processing");
            }
        }
    }

    function addHoverListeners(img, imageManager) {
        if (!CONFIG.enableHoverPreview) return;

        const link = img.closest("a");
        if (!link) return;

        const postId = extractPostIdFromUrl(link.href);
        if (!postId) return;

        let previewTimeout;

        const handleMouseEnter = async (event) => {
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(async () => {
                const imageUrl = await imageManager.fetchImageUrlForPreview(
                    postId
                );
                if (imageUrl && !imageManager.currentPreview) {
                    imageManager.showPreview(imageUrl, event);
                }
            }, CONFIG.hoverDelay);
        };

        const handleMouseLeave = () => {
            clearTimeout(previewTimeout);
            imageManager.hidePreview();
        };

        const handleMouseMove = (event) => {
            if (imageManager.currentPreview) {
                imageManager.positionPreview(event);
            }
        };

        img.addEventListener("mouseenter", handleMouseEnter);
        img.addEventListener("mouseleave", handleMouseLeave);
        img.addEventListener("mousemove", handleMouseMove);
    }

    function createToggleButton(imageManager) {
        const button = document.createElement("button");
        button.id = "preview-toggle-button";
        button.textContent = CONFIG.enableHoverPreview
            ? "Preview: ON"
            : "Preview: OFF";
        if (!CONFIG.enableHoverPreview) button.classList.add("disabled");

        button.addEventListener("click", () => {
            CONFIG.enableHoverPreview = !CONFIG.enableHoverPreview;
            button.textContent = CONFIG.enableHoverPreview
                ? "Preview: ON"
                : "Preview: OFF";
            if (
                !CONFIG.enableHoverPreview &&
                !button.classList.contains("disabled")
            )
                button.classList.add("disabled");
            else button.classList.remove("disabled");

            if (!CONFIG.enableHoverPreview) {
                // Hide any current preview
                imageManager.hidePreview();
            }

            // Update all existing images with/without hover listeners
            updateHoverListeners(imageManager);
        });

        // document.body.appendChild(button);

        // Insert after the show-posts-link element
        const postsSection = document.querySelector("#post-sections li");
        if (postsSection) {
            postsSection.appendChild(button);
        } else {
            // Fallback to body if show-posts-link not found
            document.body.appendChild(button);
        }
        return button;
    }

    function updateHoverListeners(imageManager) {
        const justifiedContainer = document.getElementById(
            "justified-gallery-container"
        );
        if (!justifiedContainer) return;

        const images = justifiedContainer.querySelectorAll("img");

        if (CONFIG.enableHoverPreview) {
            // Add hover listeners to images that don't have them
            images.forEach((img) => {
                if (!img.dataset.hoverListeners) {
                    addHoverListeners(img, imageManager);
                    img.dataset.hoverListeners = "true";
                }
            });

            // Create hover container if it doesn't exist
            if (!imageManager.hoverContainer) {
                imageManager.createHoverContainer();
            }
        } else {
            // Remove hover listeners by cloning and replacing elements
            images.forEach((img) => {
                if (img.dataset.hoverListeners) {
                    const newImg = img.cloneNode(true);
                    delete newImg.dataset.hoverListeners;
                    img.parentNode.replaceChild(newImg, img);
                }
            });
        }
    }

    // Post info tooltip functions
    // Add this after creating the tooltip or in your existing event listeners
    function preventPageScrollOnTooltip(tooltip) {
        tooltip.addEventListener(
            "wheel",
            function (e) {
                const scrollTop = tooltip.scrollTop;
                const scrollHeight = tooltip.scrollHeight;
                const height = tooltip.clientHeight;

                const delta = e.deltaY;
                const isScrollingUp = delta < 0;
                const isScrollingDown = delta > 0;

                // Prevent scrolling up when already at the top
                if (isScrollingUp && scrollTop === 0) {
                    e.preventDefault();
                    return;
                }

                // Prevent scrolling down when already at the bottom
                if (isScrollingDown && scrollTop + height >= scrollHeight) {
                    e.preventDefault();
                    return;
                }
            },
            { passive: false }
        );
    }

    function createTooltip() {
        const tooltip = document.createElement("div");
        tooltip.className = "post-info-tooltip";
        tooltip.id = "post-info-tooltip";
        document.body.appendChild(tooltip);

        // Add scroll containment
        preventPageScrollOnTooltip(tooltip);

        return tooltip;
    }

    function positionTooltip(tooltip, button) {
        const buttonRect = button.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // Add scroll offsets to convert viewport coordinates to document coordinates
        const scrollX =
            window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY =
            window.pageYOffset || document.documentElement.scrollTop;

        let left, top;

        // Try to position to the right first
        if (buttonRect.right + tooltipRect.width + 20 < viewport.width) {
            left = buttonRect.right + 10 + scrollX;
        } else {
            // Position to the left
            left = buttonRect.left - tooltipRect.width - 10 + scrollX;
        }

        // Vertical centering with bounds checking
        top =
            buttonRect.top +
            buttonRect.height / 2 -
            tooltipRect.height / 2 +
            scrollY;

        // Keep within viewport bounds (adjust bounds checking to account for scroll)
        const minTop = 10 + scrollY;
        const maxTop = scrollY + viewport.height - tooltipRect.height - 10;
        const minLeft = 10 + scrollX;
        const maxLeft = scrollX + viewport.width - tooltipRect.width - 10;

        if (top < minTop) top = minTop;
        if (top > maxTop) top = maxTop;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }

    function parsePostInfo(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const result = {
            tags: {
                artist: [],
                copyright: [],
                character: [],
                general: [],
                meta: [],
            },
            info: [],
            options: [],
        };

        // Parse tags
        const tagLists = {
            "artist-tag-list": "artist",
            "copyright-tag-list": "copyright",
            "character-tag-list": "character",
            "general-tag-list": "general",
            "meta-tag-list": "meta",
        };

        Object.entries(tagLists).forEach(([className, type]) => {
            const list = doc.querySelector(`ul.${className}`);
            if (list) {
                const items = list.querySelectorAll("li");
                items.forEach((item) => {
                    const link = item.querySelector(".search-tag");
                    const count = item.querySelector(".post-count");
                    if (link) {
                        result.tags[type].push({
                            name: link.textContent.trim(),
                            href: link.getAttribute("href"),
                            count: count ? count.textContent.trim() : "",
                            tagType:
                                item.className.match(/tag-type-(\d+)/)?.[1] ||
                                "0",
                        });
                    }
                });
            }
        });

        // Parse information section
        const infoSection = doc.querySelector("#post-information ul");
        if (infoSection) {
            const items = infoSection.querySelectorAll("li");
            items.forEach((item) => {
                const text = item.textContent.trim();
                const links = Array.from(item.querySelectorAll("a")).map(
                    (a) => ({
                        text: a.textContent.trim(),
                        href: a.getAttribute("href"),
                    })
                );
                result.info.push({ text, links, html: item.innerHTML });
            });
        }

        // Parse options section
        const optionsSection = doc.querySelector("#post-options ul");
        if (optionsSection) {
            const items = optionsSection.querySelectorAll("li");
            items.forEach((item) => {
                const text = item.textContent.trim();
                const links = Array.from(item.querySelectorAll("a")).map(
                    (a) => ({
                        text: a.textContent.trim(),
                        href: a.getAttribute("href"),
                    })
                );
                result.options.push({ text, links, html: item.innerHTML });
            });
        }

        return result;
    }

    function renderTooltipContent(data) {
        let html = "";
        // Add cancel/exit button
        html += `
        <div class="tooltip-exit-button-container">
            <button id="tooltip-exit-button" class="tooltip-exit-button" >×</button>
        </div>
    `;
        // Render tags by category
        const tagOrder = [
            "artist",
            "copyright",
            "character",
            "general",
            "meta",
        ];
        const tagLabels = {
            artist: "Artist",
            copyright: "Copyright",
            character: "Character",
            general: "General",
            meta: "Meta",
        };
        tagOrder.forEach((type) => {
            if (data.tags[type].length > 0) {
                html += `<div class="tooltip-section">`;
                html += `<h3>${tagLabels[type]}</h3>`;
                html += `<div class="tooltip-tags">`;
                data.tags[type].forEach((tag) => {
                    html += `<a href="${tag.href}" class="tooltip-tag tag-type-${tag.tagType}">${tag.name}</a>`;
                });
                html += `</div></div>`;
            }
        });
        // Render information section
        if (data.info.length > 0) {
            html += `<div class="tooltip-section tooltip-info">`;
            html += `<h3>Information</h3>`;
            html += `<ul>`;
            data.info.forEach((item) => {
                html += `<li>${item.html}</li>`;
            });
            html += `</ul></div>`;
        }
        // Render options section
        if (data.options && data.options.length > 0) {
            html += `<div class="tooltip-section tooltip-options">`;
            html += `<h3>Options</h3>`;
            html += `<ul>`;
            data.options.forEach((option) => {
                html += `<li>${option.html}</li>`;
            });
            html += `</ul></div>`;
        }
        return html;
    }

    function showPostInfo(postId, button) {
        let tooltip = document.getElementById("post-info-tooltip");
        if (!tooltip) {
            tooltip = createTooltip();
        }

        // Hide tooltip if clicking the same button
        if (
            tooltip.classList.contains("visible") &&
            tooltip.dataset.currentPostId === postId
        ) {
            tooltip.classList.remove("visible");
            return;
        }

        tooltip.dataset.currentPostId = postId;
        tooltip.innerHTML =
            '<div class="tooltip-loading">Loading post information...</div>';
        tooltip.classList.add("visible");
        positionTooltip(tooltip, button);

        // Fetch post information
        fetch(`https://danbooru.donmai.us/posts/${postId}`)
            .then((response) => response.text())
            .then((html) => {
                const data = parsePostInfo(html);
                tooltip.innerHTML = renderTooltipContent(data);
                positionTooltip(tooltip, button);
            })
            .catch((error) => {
                console.error("Error fetching post info:", error);
                tooltip.innerHTML =
                    '<div class="tooltip-loading">Error loading post information</div>';
            });
    }

    function addInfoBtnHandlers() {
        document.addEventListener("click", function (e) {
            if (e.target.classList.contains("info-button")) {
                e.preventDefault();
                e.stopPropagation();
                const postId = e.target.getAttribute("data-post-id");
                showPostInfo(postId, e.target);
            }
        });

        // Hide tooltip when clicking outside or on exit button
        function addGlobalTooltipHandler() {
            document.addEventListener("click", function (e) {
                const tooltip = document.getElementById("post-info-tooltip");

                // If tooltip-exit-button clicked, hide tooltip
                if (e.target.id === "tooltip-exit-button") {
                    tooltip?.classList.remove("visible");
                    return;
                }

                // If click is outside tooltip and info-button, hide tooltip
                if (
                    tooltip &&
                    !e.target.closest(".info-button") &&
                    !e.target.closest(".post-info-tooltip")
                ) {
                    tooltip.classList.remove("visible");
                }
            });

            // Hide tooltip on Escape key press
            document.addEventListener("keydown", function (e) {
                if (e.key === "Escape" || e.key === "Esc") {
                    tooltip?.classList.remove("visible");
                }
            });
        }

        addGlobalTooltipHandler();
    }

    function initializeJustifiedGallery() {
        const postsContainer = document.querySelector(".posts-container");
        if (!postsContainer) return;

        // Create justified gallery container
        const justifiedContainer = document.createElement("div");
        justifiedContainer.className = "justified-gallery";
        justifiedContainer.id = "justified-gallery-container";

        // Convert posts to justified gallery format
        const posts = postsContainer.querySelectorAll("article.post-preview");

        posts.forEach((post) => {
            const link = post.querySelector(".post-preview-link");
            const img = post.querySelector(".post-preview-image");

            if (link && img) {
                //
                const postId = post.getAttribute("data-id");
                const score = post.getAttribute("data-score") || "0";

                // Create new anchor element for justified gallery
                const newLink = document.createElement("a");
                newLink.href = link.href;
                // newLink.title = img.getAttribute("data-title") || img.alt;

                // Create new image element
                const newImg = document.createElement("img");
                newImg.src = img.src;
                newImg.alt = img.alt;
                // newImg.title = img.title;

                // Set data attributes for justified gallery
                newImg.setAttribute("data-safe-src", img.src);

                // Get original dimensions if available
                const width =
                    img.getAttribute("width") || img.naturalWidth || 180;
                const height =
                    img.getAttribute("height") || img.naturalHeight || 180;

                newImg.setAttribute("width", width);
                newImg.setAttribute("height", height);

                // Create caption element
                const caption = document.createElement("div");
                caption.className = "jg-caption";
                caption.addEventListener("click", handleCaptionClick);

                let scoreState;
                if (parseInt(score) > 0) scoreState = "positive";
                else if (parseInt(score) < 0) scoreState = "negative";
                else scoreState = "neutral";

                let html = `
                    <span class="caption-button upvote-btn" data-post-id="${postId}">🡅</span>
                    <span class="score-display ${scoreState}">${score}</span>
                    <span class="caption-button favorite-btn" data-post-id="${postId}">❤︎</span>
                    <div class="right-side-wrapper">
                `;

                // get content duration
                let contentDuration = post.querySelector(
                    "a.post-preview-link div.post-animation-icon .post-duration"
                );
                if (contentDuration) {
                    contentDuration = contentDuration.textContent.trim();
                    const durLabelHTML = `<span class="content-duration">${contentDuration}</span>`;
                    html += durLabelHTML;
                }

                html += `<span class="info-button" data-post-id="${postId}">🛈</span>`;
                html += "</div>";
                caption.innerHTML += html;

                newLink.appendChild(newImg);
                newLink.appendChild(caption);
                justifiedContainer.appendChild(newLink);
            }
        });

        // Insert justified gallery container
        postsContainer.parentNode.insertBefore(
            justifiedContainer,
            postsContainer
        );

        // Initialize justified gallery
        $(justifiedContainer).justifiedGallery(JG_CONFIG);

        // Initialize high-res loading
        if (CONFIG.enableHighRes) {
            const imageManager = new ImageManager();
            const observer = createIntersectionObserver(imageManager);

            // Store references for cleanup
            justifiedContainer.imageManager = imageManager;
            justifiedContainer.intersectionObserver = observer;

            // Create toggle button
            if (!document.getElementById("preview-toggle-button")) {
                justifiedContainer.toggleButton =
                    createToggleButton(imageManager);
            }

            // Observe all images and add hover listeners
            const images = justifiedContainer.querySelectorAll("img");
            images.forEach((img) => {
                observer.observe(img);
                if (CONFIG.enableHoverPreview) {
                    addHoverListeners(img, imageManager);
                    img.dataset.hoverListeners = "true";
                }
            });
        }
    }

    function handleDynamicContent() {
        // Watch for dynamically loaded content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Element node
                            // Check if new posts were added
                            if (
                                node.matches &&
                                node.matches("article.post-preview")
                            ) {
                                updateJustifiedGallery();
                            } else if (
                                node.querySelector &&
                                node.querySelector("article.post-preview")
                            ) {
                                updateJustifiedGallery();
                            }
                        }
                    });
                }
            });
        });

        const postsContainer = document.querySelector(".posts-container");
        if (postsContainer) {
            observer.observe(postsContainer, {
                childList: true,
                subtree: true,
            });
        }
    }

    function updateJustifiedGallery() {
        const justifiedContainer = document.getElementById(
            "justified-gallery-container"
        );
        const postsContainer = document.querySelector(".posts-container");

        if (!justifiedContainer || !postsContainer) return;

        // Get new posts that aren't in the justified gallery yet
        const existingLinks = justifiedContainer.querySelectorAll("a");
        const existingHrefs = Array.from(existingLinks).map(
            (link) => link.href
        );

        const newPosts = postsContainer.querySelectorAll(
            "article.post-preview"
        );

        newPosts.forEach((post) => {
            const link = post.querySelector(".post-preview-link");
            const img = post.querySelector(".post-preview-image");

            if (link && img && !existingHrefs.includes(link.href)) {
                //
                const postId = post.getAttribute("data-id");
                const score = post.getAttribute("data-score") || "0";
                // Create new anchor element for justified gallery
                const newLink = document.createElement("a");
                newLink.href = link.href;
                // newLink.title = img.getAttribute("data-title") || img.alt;

                // Create new image element
                const newImg = document.createElement("img");
                newImg.src = img.src;
                newImg.alt = img.alt;
                // newImg.title = img.title;

                // Set data attributes for justified gallery
                newImg.setAttribute("data-safe-src", img.src);

                // Get original dimensions if available
                const width =
                    img.getAttribute("width") || img.naturalWidth || 180;
                const height =
                    img.getAttribute("height") || img.naturalHeight || 180;

                newImg.setAttribute("width", width);
                newImg.setAttribute("height", height);

                // Create caption element
                const caption = document.createElement("div");
                caption.className = "jg-caption";
                caption.addEventListener("click", handleCaptionClick);

                let scoreState;
                if (parseInt(score) > 0) scoreState = "positive";
                else if (parseInt(score) < 0) scoreState = "negative";
                else scoreState = "neutral";

                let html = `
                    <span class="caption-button upvote-btn" data-post-id="${postId}">🡅</span>
                    <span class="score-display ${scoreState}">${score}</span>
                    <span class="caption-button favorite-btn" data-post-id="${postId}">❤︎</span>
                    <div class="right-side-wrapper">
                `;

                // get content duration
                let contentDuration = post.querySelector(
                    "a.post-preview-link div.post-animation-icon .post-duration"
                );
                if (contentDuration) {
                    contentDuration = contentDuration.textContent.trim();
                    const durLabelHTML = `<span class="content-duration">${contentDuration}</span>`;
                    html += durLabelHTML;
                }

                html += `<span class="info-button" data-post-id="${postId}">🛈</span>`;
                html += "</div>";
                caption.innerHTML += html;

                newLink.appendChild(newImg);
                newLink.appendChild(caption);
                justifiedContainer.appendChild(newLink);

                // Observe new images for high-res loading
                if (
                    CONFIG.enableHighRes &&
                    justifiedContainer.intersectionObserver
                ) {
                    const newImages = justifiedContainer.querySelectorAll(
                        "img:not([data-high-res-loading])"
                    );
                    newImages.forEach((img) => {
                        justifiedContainer.intersectionObserver.observe(img);
                    });
                }

                // Add hover listeners to new images
                if (
                    CONFIG.enableHoverPreview &&
                    justifiedContainer.imageManager
                ) {
                    const newImages = justifiedContainer.querySelectorAll(
                        "img:not([data-hover-listeners])"
                    );
                    newImages.forEach((img) => {
                        addHoverListeners(img, justifiedContainer.imageManager);
                        img.dataset.hoverListeners = "true";
                    });
                }
            }
        });

        // Refresh justified gallery
        $(justifiedContainer).justifiedGallery("norewind");
    }

    function createReloadButton() {
        // Create the reload button
        const reloadButton = document.createElement("button");
        reloadButton.textContent = "↻";
        reloadButton.id = "jg-reload-btn";

        const postsSection = document.querySelector("#post-sections li");

        if (postsSection) {
            postsSection.appendChild(reloadButton);
        }

        // reloadButton.addEventListener("click", (e) => {
        //     e.preventDefault();
        //     cleanup();
        //     initializeJustifiedGallery();
        //     handleDynamicContent();
        // });
    }

    function relocateSearchBar() {
        // Find the search form
        const searchForm = document.getElementById("search-box-form");
        const contentSection = document.getElementById("content");

        if (!searchForm || !contentSection) {
            // console.log(
            //     "Search form or content section not found, retrying..."
            // );
            return false;
        }

        // Hide the original search form container to prevent empty space
        const originalContainer = searchForm.closest(
            '.search-box, #search-box, [class*="search"]'
        );
        if (originalContainer && originalContainer !== searchForm) {
            originalContainer.style.display = "none";
        }

        // Create a new container for the relocated search bar
        const searchContainer = document.createElement("div");
        searchContainer.id = "relocated-search-container";
        searchContainer.style.cssText = `
            display: flex;
            justify-content: stretch;
            margin-bottom: 5px;
            padding: 0;
        `;

        // Style the search form
        searchForm.style.cssText = `
            display: flex;
            align-items: center;
            width: 100%;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;

        // Style the search input
        const searchInput = searchForm.querySelector("#tags");
        if (searchInput) {
            searchInput.style.cssText = `
                flex: 1;
                padding: 8px 12px;
                border: none;
                background: transparent;
                color: #fff;
                font-size: 14px;
                outline: none;
                min-width: 0;
            `;

            // Add placeholder styling
            searchInput.setAttribute(
                "placeholder",
                searchInput.getAttribute("placeholder") || "Search tags..."
            );
        }

        // Style the search button
        const searchButton = searchForm.querySelector("#search-box-submit");
        if (searchButton) {
            searchButton.style.cssText = `
                padding: 8px 12px;
                border: none;
                background: #0066cc;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.2s;
                min-width: 40px;
            `;

            // Add hover effect
            searchButton.addEventListener("mouseenter", function () {
                this.style.backgroundColor = "#0052a3";
            });

            searchButton.addEventListener("mouseleave", function () {
                this.style.backgroundColor = "#0066cc";
            });
        }

        // Style the search icon
        const searchIcon = searchForm.querySelector(".search-icon");
        if (searchIcon) {
            searchIcon.style.cssText = `
                width: 16px;
                height: 16px;
            `;
        }

        // Move the search form to the new container
        searchContainer.appendChild(searchForm);

        // Insert the container at the top of the content section
        contentSection.insertBefore(searchContainer, contentSection.firstChild);

        // console.log('Search bar successfully relocated!');
        return true;
    }

    function addJgResetHandlers(cssSelectorArray) {
        // add event handlers to reset justified gallery
        setTimeout(() => {
            if (cssSelectorArray.length > 0) {
                cssSelectorArray.forEach((el_sel) => {
                    const btn = document.querySelector(el_sel);
                    if (btn) {
                        btn.addEventListener("click", () => {
                            setTimeout(() => {
                                cleanup();
                                initializeJustifiedGallery();
                                handleDynamicContent();
                            }, 0);
                        });
                    }
                });
            }
        }, 500);
    }

    // ================

    // Inject Justified Gallery CSS
    let css = `
            @import url("https://cdnjs.cloudflare.com/ajax/libs/justifiedGallery/3.8.1/css/justifiedGallery.min.css");

            /* Custom styles for Danbooru integration */
            .justified-gallery {
                margin: 0;
                padding: 0;
            }

            .justified-gallery > a {
                border: 2px solid transparent;
                border-radius: 6px;
                background: none !important;
                transition: border 0.2s ease, box-shadow 0.2s ease;
            }

            .justified-gallery > a:hover {
                border: 2px solid #faf9f6;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .justified-gallery > a > img {
                transition: transform 0.2s ease;
            }

            .justified-gallery > a:hover > img {
                transform: scale(1.02);
            }

            /* Hide original gallery */
            .post-gallery-grid .posts-container {
                display: none;
            }

            /* Ensure proper spacing */
            #posts {
                padding: 10px 0px;
            }

            /* Loading indicator */
            .jg-loading {
                opacity: 0.6;
            }

            .justified-gallery > a > img {
                border-radius: 4px;
                transition: transform 0.2s ease, opacity 0.3s ease;
            }

            .justified-gallery > a > img[data-high-res-loading="true"] {
                opacity: 1;
            }

            .justified-gallery > a > img[data-high-res-loaded="true"] {
                opacity: 1;
            }

            /* Caption styling */

            .jg-caption {
                transition: border 0.2s ease, box-shadow 0.2s ease !important;
                padding: 4px !important;
                font-size: 14px !important;
                font-weight: 500 !important;
            }

            .caption-button {
                opacity: 1;
                /*font-size: 14px;
                                font-weight: 600;*/
                cursor: pointer;
                padding: 2px 4px;
                border-radius: 2px;
                transition: background-color 0.2s ease;
                user-select: none;
            }

            .caption-button:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            /* .caption-button.active {
                        background-color: rgba(255, 255, 255, 0.3);
                    } */

            .score-display {
                /*font-size: 14px;
                                font-weight: 600;*/
                padding: 2px 2px 2px 0px;
            }

            .caption-button.processing {
                opacity: 0.5;
            }

            .caption-button.processing:hover {
                background-color: transparent;
            }

            .jg-caption .score-display.positive {
                color: green;
            }

            .jg-caption .score-display.negative {
                color: red;
            }

            .jg-caption .favorite-btn.active {
                color: red;
            }

            .jg-caption .upvote-btn.active {
                color: green;
            }

            .jg-caption .content-duration {
                padding: 2px 4px;
                right: 8px;
            }

            #danbooru-hover-preview {
                position: fixed;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
                overflow: visible; /* Changed from hidden to visible */
            }

            #danbooru-hover-preview.visible {
                opacity: 1;
            }

            #danbooru-hover-preview img {
                display: block;
                /* Removed max-height and max-width constraints */
                /* Size will be controlled by JavaScript and transform scaling */
                height: auto;
                width: auto;
                /* Ensure smooth scaling */
                image-rendering: -webkit-optimize-contrast;
                image-rendering: crisp-edges;
                border: 4px solid #faf9f6;
                border-radius: 4px;
                box-shadow: rgba(0, 0, 0, 0.5) 1px 1px 5px, rgba(0, 0, 0, 0.5) -1px 1px 5px,
                    rgba(0, 0, 0, 0.5) 1px -1px 5px, rgba(0, 0, 0, 0.5) -1px -1px 5px;
            }

            #preview-toggle-button {
                background: rgb(0, 116, 172);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 3px 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                margin-left: 10px;
                transition: all 0.2s ease;
                user-select: none;
                vertical-align: middle;
            }

            #preview-toggle-button {
                background: rgb(0, 116, 172);
                color: white;
                border: none;
                border-radius: 4px;
                padding: 3px 6px;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                margin-left: 10px;
                transition: all 0.2s ease;
                user-select: none;
                vertical-align: middle;
            }

            #preview-toggle-button:hover {
                background: #23598fff;
            }

            #preview-toggle-button:active {
                transform: scale(0.98);
            }

            #preview-toggle-button.disabled {
                background: #666;
                cursor: not-allowed;
            }

            #preview-toggle-button.disabled:hover {
                background: #666;
            }

            #jg-reload-btn {
                background-color: rgb(0, 116, 172);
                color: white;
                border: none;
                padding: 3px 6px;
                border-radius: 4px;
                font-size: 13px;
                cursor: pointer;
                font-weight: 500;
                margin-left: 10px;
                transition: all 0.2s ease;
                user-select: none;
                vertical-align: middle;
            }

            #jg-reload-btn:hover {
                background-color: #23598fff;
            }

            /* Info tooltip styles */
            .info-button {
                cursor: pointer;
                padding: 2px 4px;
                border-radius: 2px;
                transition: background-color 0.2s ease;
                user-select: none;
            }

            .info-button:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }

            .post-info-tooltip {
                position: absolute;
                z-index: 1000;
                background: rgba(20, 20, 20, 0.95);
                border: 1px solid #444;
                border-radius: 6px;
                padding: 8px;
                max-width: 200px;
                min-width: 180px;
                max-height: 300px; /* Enables vertical scrolling when content is too long */
                overflow-y: auto; /* Scrollbar appears only when needed */
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
                color: #fff;
                font-size: 11px;
                line-height: 1.3;
                backdrop-filter: blur(8px);
                display: none;
                scrollbar-width: thin; /* For Firefox */
            }

            /* Optional scrollbar styling for WebKit browsers (Chrome, Edge, Safari) */
            .post-info-tooltip::-webkit-scrollbar {
                width: 6px;
            }
            .post-info-tooltip::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
            }

            .post-info-tooltip.visible {
                display: block;
            }

            .tooltip-section {
                margin-bottom: 16px;
            }

            .tooltip-section:last-child {
                margin-bottom: 0;
            }

            .tooltip-section h3 {
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: bold;
                color: #ccc;
                border-bottom: 1px solid #444;
                padding-bottom: 4px;
            }

            .tooltip-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-bottom: 8px;
            }

            .tooltip-tag {
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 12px;
                text-decoration: none;
                color: white;
                transition: opacity 0.2s ease;
            }

            .tooltip-tag:hover {
                opacity: 0.8;
            }

            .tooltip-info ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .tooltip-info li {
                margin-bottom: 6px;
                font-size: 12px;
                color: #ccc;
            }

            .tooltip-info a {
                color: #66b3ff;
                text-decoration: none;
            }

            .tooltip-info a:hover {
                text-decoration: underline;
            }

            .tooltip-loading {
                text-align: center;
                color: #888;
                padding: 20px;
            }

            .tooltip-exit-button-container {
                position: sticky;
                top: 0;
                z-index: 1001;
            }

            .tooltip-exit-button {
                position: absolute;
                top: 8px;
                right: 8px;
                position: absolute;
                top: 0px;
                right: 0px;
                border: none;
                background: transparent;
                font-size: 20px;
                font-weight: bold;
                cursor: pointer;
                color: #888;
                padding: 0px 4px;
            }

            .tooltip-exit-button:hover {
                color: #000;
            }

            .jg-caption .right-side-wrapper {
            position:absolute;
            right: 4px;
            bottom: 4px;
            }
    `;

    function init() {
        // add styles
        const style = document.createElement("style");
        if (CONFIG.enableHiddenSidebar) css += "#sidebar {display: none;}"; // hide sidebar
        style.textContent = css;
        document.head.appendChild(style);

        // Add reload button to reset JG
        createReloadButton();

        // main fuctions
        initializeJustifiedGallery();
        handleDynamicContent();

        // Add JG reset calls to other buttons on the page

        addJgResetHandlers(JG_RESET_SELECTORS);
        // relocate search bar
        if (CONFIG.enableRelocateSearchBar) relocateSearchBar();

        // add info btn handlers
        addInfoBtnHandlers();

        // Handle page navigation (for single-page apps)
        let currentUrl = window.location.href;
        new MutationObserver(() => {
            if (currentUrl !== window.location.href) {
                currentUrl = window.location.href;
                cleanup();
                setTimeout(() => {
                    initializeJustifiedGallery();
                    handleDynamicContent();
                }, 500);
            }
        }).observe(document.body, { childList: true, subtree: true });

        // Reset on zoom/resize events to avoid HRT bug
        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout); // Clear previous timeout
            resizeTimeout = setTimeout(() => {
                cleanup();
                initializeJustifiedGallery();
                handleDynamicContent();
            }, 300);
        });

        // Prevent error message by defining resetImgSrc as a no-op on images
        if (
            typeof HTMLImageElement !== "undefined" &&
            !HTMLImageElement.prototype.resetImgSrc
        )
            HTMLImageElement.prototype.resetImgSrc = function () {};
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(() => {
                init();
            }, 100);
        });
    } else {
        setTimeout(() => {
            init();
        }, 100);
    }
})();
