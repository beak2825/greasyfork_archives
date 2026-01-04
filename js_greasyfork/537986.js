// ==UserScript==
// @name         Ultra Galleries
// @namespace    https://sleazyfork.org/en/users/1477603-%E3%83%A1%E3%83%AA%E3%83%BC
// @version      3.4.1
// @description  Modern image gallery with highly efficient background zipping, video playback, enhanced browsing, fullscreen, and download features. Memory leaks fixed.
// @author       ntf (original), Meri/TearTyr (maintained)
// @match        *://kemono.su/*
// @match        *://coomer.su/*
// @match        *://kemono.cr/*
// @match        *://coomer.cr/*
// @match        *://coomer.st/*
// @match        *://nekohouse.su/*
// @icon         https://kemono.party/static/menu/recent.svg
// @grant        GM_download
// @grant        GM.download
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        window.open
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/jszip@3.9.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.2/FileSaver.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://unpkg.com/dexie@3.2.7/dist/dexie.min.js
// @resource     upngJsRaw https://unpkg.com/upng-js@2.1.0/UPNG.js
// @resource     pakoJsRaw https://unpkg.com/pako@2.1.0/dist/pako.min.js
// @resource     jszipJsRaw https://unpkg.com/jszip@3.9.1/dist/jszip.min.js
// @resource     mainCSS https://raw.githubusercontent.com/TearTyr/Ultra-Galleries/refs/heads/main/Ultra-Galleries.css
// @downloadURL https://update.greasyfork.org/scripts/537986/Ultra%20Galleries.user.js
// @updateURL https://update.greasyfork.org/scripts/537986/Ultra%20Galleries.meta.js
// ==/UserScript==
(() => {
'use strict';

// ====================================================
// Core Configuration
// ====================================================
const CONFIG = {
    BATCH_SIZE: 3,
    MAX_CONCURRENT_FETCHES: 3,
    MAX_RETRIES: 5,
    RETRY_DELAY: 2000,
    MIN_SCALE: 0.05,
    MAX_SCALE: 5,
    ZOOM_STEP: 0.2,
    DEBOUNCE_DELAY: 250,
    PAN_RESISTANCE: 0.8,
    DOUBLE_TAP_THRESHOLD: 300,
    CACHE_EVICTION_COUNT: 20,
    PRELOAD_COUNT: 2,
};

const BUTTONS = {
    DOWNLOAD: '【DOWNLOAD】',
    DOWNLOAD_ALL: '【DL ALL】',
    FULL: '【FULL】',
    HEIGHT: '【FILL HEIGHT】',
    REMOVE: '【REMOVE】',
    WIDTH: '【FILL WIDTH】',
    GALLERY: '【GALLERY】',
    SETTINGS: '⚙️',
    FULLSCREEN: '⛶',
    CLOSE: '✕'
};

// CSS class names
const CSS = {
    BTN: 'ug-button',
    BTN_CONTAINER: 'ug-button-container',
    LOADING: 'loading-overlay',
    NOTIF_AREA: 'ug-notification-area',
    NOTIF_CONTAINER: 'ug-notification-container',
    NOTIF_TEXT: 'ug-notification-text',
    NOTIF_CLOSE: 'ug-notification-close',
    NOTIF_REPORT: 'ug-notification-report',
    SETTINGS_BTN: 'settings-button',
    VIRTUAL_IMAGE: 'virtual-image',
    LONG_PRESS: 'ug-long-press',
    // Gallery classes
    GALLERY: {
        OVERLAY: 'ug-gallery-overlay',
        CONTAINER: 'ug-gallery-container',
        GRID_VIEW: 'ug-gallery-grid-view',
        EXPANDED_VIEW: 'ug-gallery-expanded-view',
        HIDE: 'ug-gallery-hide',
        TOOLBAR: 'ug-gallery-toolbar',
        ZOOM_CONTAINER: 'ug-gallery-zoom-container',
        MAIN_IMG_CONTAINER: 'ug-main-image-container',
        MAIN_IMG: 'ug-main-image',
        MAIN_VIDEO: 'ug-main-video',
        THUMBNAIL: 'ug-gallery-thumbnail',
        THUMBNAIL_GRID: 'ug-gallery-thumbnail-grid',
        THUMBNAIL_CONTAINER: 'ug-gallery-thumbnail-grid-container',
        THUMBNAIL_STRIP: 'ug-thumbnail-strip',
        THUMBNAIL_ITEM: 'ug-thumbnail',
        NAV: 'ug-gallery-nav',
        NAV_CONTAINER: 'ug-gallery-nav-container',
        PREV: 'ug-gallery-prev',
        NEXT: 'ug-gallery-next',
        COUNTER: 'ug-gallery-counter',
        FULLSCREEN: 'ug-gallery-fullscreen',
        FULLSCREEN_OVERLAY: 'ug-fullscreen-overlay',
        GRID_CLOSE: 'ug-gallery-grid-close',
        STRIP_CONTAINER: 'ug-gallery-thumbnail-strip-container',
        TOOLBAR_BTN: 'ug-toolbar-button',
        CONTROLS_HIDDEN: 'ug-controls-hidden',
        GRABBING: 'ug-grabbing',
        ZOOMED: 'zoomed',
        IS_TRANSITIONING: 'is-transitioning',
        IMAGE_ERROR_MSG: 'ug-image-error-message',
    },
    // Settings classes
    SETTINGS: {
        OVERLAY: 'ug-settings-overlay',
        CONTAINER: 'ug-settings-container',
        HEADER: 'ug-settings-header',
        BODY: 'ug-settings-body',
        CLOSE_BTN: 'ug-settings-close-btn',
        SECTION: 'ug-settings-section',
        SECTION_HEADER: 'ug-settings-section-header',
        LABEL: 'ug-settings-label',
        INPUT: 'ug-settings-input',
        CHECKBOX_LABEL: 'ug-settings-checkbox-label',
    }
};

// Website-specific selectors
const website = window.location.hostname.split('.')[0];
const SELECTORS = {
    IMAGE_LINK: website === 'nekohouse' ? 'a.image-link:not(.scrape__user-profile)' : 'a.fileThumb.image-link',
    ATTACHMENT_LINK: website === 'nekohouse' ? '.scrape__attachment-link' : '.post__attachment-link',
    POST_TITLE: website === 'nekohouse' ? '.scrape__title' : '.post__title',
    POST_USER_NAME: website === 'nekohouse' ? '.scrape__user-name' : '.post__user-name',
    POST_IMAGE: 'img.post__image',
    THUMBNAIL: website === 'nekohouse' ? '.scrape__thumbnail' : '.post__thumbnail',
    MAIN_THUMBNAIL: website === 'nekohouse' ? '.scrape__thumbnail:not(.scrape__thumbnail--attachment)' : '.post__thumbnail:not(.post__thumbnail--attachment)',
    POST_ACTIONS: website === 'nekohouse' ? '.scrape__actions' : '.post__actions',
    FAVORITE_BUTTON: website === 'nekohouse' ? '.scrape__actions a.favorite-button' : '.post__actions a.favorite-button',
    FILE_DIVS: website === 'nekohouse' ? '.scrape__thumbnail' : '.post__thumbnail',
    FILES_IMG: website === 'nekohouse' ? '.scrape__files img' : 'img.post__image',
    VIDEO_LINK: 'a.fileThumb[href$=".mp4"], a.fileThumb[href$=".webm"], a.fileThumb[href$=".mov"]',
    VIDEO_THUMBNAIL: website === 'nekohouse' ? '.scrape__video-thumbnail' : '.post__video-thumbnail',
};

// ====================================================
// Utility Functions
// ====================================================
const Utils = {
    getExtension: filename => filename.split('.').pop().toLowerCase() || 'jpg',
    sanitizeFileName: name => name.replace(/[/\\:*?"<>|]/g, '-'),
    setImageStyle: (img, styles) => img && Object.assign(img.style, styles),
    isPostPage: () => {
        const url = window.location.href;
        const patterns = [
            /https:\/\/(kemono\.su|coomer\.su|coomer\.st|nekohouse\.su|kemono\.cr|coomer\.cr)\/.*\/post\//,
            /https:\/\/(kemono\.su|coomer\.su|coomer\.st|nekohouse\.su|kemono\.cr|coomer\.cr)\/.*\/user\/.*\/post\//,
        ];
        return patterns.some(pattern => pattern.test(url));
    },
    delay: ms => new Promise(resolve => setTimeout(resolve, ms)),
    debounce: (func, wait) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), wait);
        };
    },
    throttle: (func, limit) => {
        let lastRan, lastFunc;
        return function (...args) {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    },
    handleMediaSrc: mediaLink => {
        const fileThumbDiv = mediaLink.querySelector('.fileThumb');
        return fileThumbDiv?.getAttribute('href')?.split('?')[0] ||
            mediaLink.getAttribute('href')?.split('?')[0] || null;
    },
    supportsPassiveEvents: () => {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                    return true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) { }
        return supportsPassive;
    },
    createTooltip: (text, duration = 3000) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'zoom-tooltip';
        tooltip.textContent = text;
        Object.assign(tooltip.style, {
            position: 'absolute',
            bottom: '120px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '5px',
            zIndex: '100',
            pointerEvents: 'none'
        });
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.5s ease';
            setTimeout(() => tooltip.remove(), 500);
        }, duration);
        return tooltip;
    },
    getDistance: (touch1, touch2) => {
        return Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
    },
    getMidpoint: (touch1, touch2) => ({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
    }),
    ensureThumbnailsExist: () => {
        try {
            const posts = document.querySelectorAll('.post');
            posts.forEach(post => {
                const hasImages = post.querySelector(SELECTORS.IMAGE_LINK) !== null;
                const hasThumbnail = post.querySelector(SELECTORS.THUMBNAIL) !== null;
                if (hasImages && !hasThumbnail) {
                    const firstImage = post.querySelector(SELECTORS.IMAGE_LINK + ' img');
                    if (firstImage) {
                        const thumbnailContainer = document.createElement('div');
                        thumbnailContainer.className = website === 'nekohouse' ? 'scrape__thumbnail' : 'post__thumbnail';
                        const thumbnailImg = document.createElement('img');
                        thumbnailImg.src = firstImage.src;
                        thumbnailImg.className = website === 'nekohouse' ? 'scrape__thumbnail-img' : 'post__thumbnail-img';
                        thumbnailContainer.appendChild(thumbnailImg);
                        const insertPoint = post.querySelector('.post__header') || post.firstChild;
                        if (insertPoint) {
                            post.insertBefore(thumbnailContainer, insertPoint.nextSibling);
                        } else {
                            post.appendChild(thumbnailContainer);
                        }
                    }
                }
            });
            const videoLinks = document.querySelectorAll(SELECTORS.VIDEO_LINK);
            videoLinks.forEach(videoLink => {
                const videoThumb = videoLink.closest(SELECTORS.VIDEO_THUMBNAIL);
                if (!videoThumb) {
                    const video = videoLink.querySelector('video');
                    if (video && video.hasAttribute('poster')) {
                        const posterUrl = video.getAttribute('poster');
                        const thumbnailContainer = document.createElement('div');
                        thumbnailContainer.className = website === 'nekohouse' ? 'scrape__video-thumbnail' : 'post__video-thumbnail';
                        const thumbnailImg = document.createElement('img');
                        thumbnailImg.src = posterUrl;
                        thumbnailImg.className = website === 'nekohouse' ? 'scrape__thumbnail-img' : 'post__thumbnail-img';
                        thumbnailContainer.appendChild(thumbnailImg);
                        videoLink.parentNode?.insertBefore(thumbnailContainer, videoLink);
                    }
                }
            });
        } catch (error) {
            console.error('Error ensuring thumbnails exist:', error);
        }
    }
};

// ====================================================
// Gallery Image Sizing Module
// ====================================================
const ImageSizing = {
    applyFillHeight: (img) => {
        if (!img) return;
        Utils.setImageStyle(img, {
            maxHeight: '100vh',
            maxWidth: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain'
        });
    },

    applyFillWidth: (img) => {
        if (!img) return;
        Utils.setImageStyle(img, {
            maxHeight: '100%',
            maxWidth: '100vw',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain'
        });
    },

    applyFullSize: (img) => {
        if (!img) return;
        Utils.setImageStyle(img, {
            maxHeight: 'none',
            maxWidth: 'none',
            height: 'auto',
            width: 'auto'
        });
    }
};

// ====================================================
// Enhanced Drag Module
// ====================================================
const EnhancedDrag = {
    isDragging: false,
    dragStartTime: 0,
    lastUpdateTime: 0,
    velocity: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    animationFrame: null,
    inertiaAnimation: null,

    startDrag: (event) => {
        if (!galleryOverlay || !galleryOverlay.length) return;
        if (event.button === 2 && event.type === 'mousedown') return;
        if (event.preventDefault) event.preventDefault();

        EnhancedDrag.isDragging = true;
        EnhancedDrag.dragStartTime = performance.now();
        EnhancedDrag.lastUpdateTime = EnhancedDrag.dragStartTime;

        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

        state.dragStartPosition = { x: clientX, y: clientY };
        state.dragStartOffset = { x: state.imageOffset.x, y: state.imageOffset.y };
        EnhancedDrag.lastPosition = { x: clientX, y: clientY };
        EnhancedDrag.velocity = { x: 0, y: 0 };

        if (EnhancedDrag.inertiaAnimation) {
            cancelAnimationFrame(EnhancedDrag.inertiaAnimation);
            EnhancedDrag.inertiaAnimation = null;
        }

        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if ($container.length) {
            $container.addClass(CSS.GALLERY.GRABBING);
            $container.css('will-change', 'transform');
        }
    },

    dragImage: (event) => {
        if (!EnhancedDrag.isDragging || !galleryOverlay || !galleryOverlay.length) return;

        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);

        if (clientX === undefined || clientY === undefined) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - EnhancedDrag.lastUpdateTime;

        if (deltaTime > 0) {
            EnhancedDrag.velocity.x = (clientX - EnhancedDrag.lastPosition.x) / deltaTime * 16;
            EnhancedDrag.velocity.y = (clientY - EnhancedDrag.lastPosition.y) / deltaTime * 16;
        }

        EnhancedDrag.lastPosition = { x: clientX, y: clientY };
        EnhancedDrag.lastUpdateTime = currentTime;

        const deltaX = clientX - state.dragStartPosition.x;
        const deltaY = clientY - state.dragStartPosition.y;

        const newOffsetX = state.dragStartOffset.x + deltaX;
        const newOffsetY = state.dragStartOffset.y + deltaY;

        state.imageOffset.x = newOffsetX;
        state.imageOffset.y = newOffsetY;

        if (!EnhancedDrag.animationFrame) {
            EnhancedDrag.animationFrame = requestAnimationFrame(EnhancedDrag.updateTransform);
        }
    },

    updateTransform: () => {
        if (!galleryOverlay || !galleryOverlay.length) return;

        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if (!$container.length) return;

        const transform = `translate(${state.imageOffset.x}px, ${state.imageOffset.y}px) scale(${state.zoomScale})`;
        $container[0].style.transform = transform;

        const $zoomDisplay = galleryOverlay.find('#zoom-level');
        if ($zoomDisplay.length && Math.abs(state.zoomScale - parseFloat($zoomDisplay.text()) / 100) > 0.01) {
            $zoomDisplay.text(`${Math.round(state.zoomScale * 100)}%`);
        }

        EnhancedDrag.animationFrame = null;
    },

    endDrag: () => {
        if (!EnhancedDrag.isDragging || !galleryOverlay || !galleryOverlay.length) return;

        EnhancedDrag.isDragging = false;

        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if ($container.length) {
            $container.removeClass(CSS.GALLERY.GRABBING);
            setTimeout(() => {
                $container.css('will-change', '');
            }, 1000);
        }

        if (state.inertiaEnabled &&
            (Math.abs(EnhancedDrag.velocity.x) > 0.5 || Math.abs(EnhancedDrag.velocity.y) > 0.5)) {
            EnhancedDrag.applyInertia();
        } else {
            EnhancedDrag.enforceBoundaries();
        }
    },

    applyInertia: () => {
        const friction = 0.95;
        const minVelocity = 0.5;

        const animate = () => {
            EnhancedDrag.velocity.x *= friction;
            EnhancedDrag.velocity.y *= friction;

            state.imageOffset.x += EnhancedDrag.velocity.x;
            state.imageOffset.y += EnhancedDrag.velocity.y;

            if (Math.abs(EnhancedDrag.velocity.x) < minVelocity && Math.abs(EnhancedDrag.velocity.y) < minVelocity) {
                EnhancedDrag.inertiaAnimation = null;
                EnhancedDrag.enforceBoundaries();
                return;
            }

            EnhancedDrag.updateTransform();
            EnhancedDrag.inertiaAnimation = requestAnimationFrame(animate);
        };

        EnhancedDrag.inertiaAnimation = requestAnimationFrame(animate);
    },

    enforceBoundaries: () => {
        if (!galleryOverlay || !galleryOverlay.length) return;

        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if (!$container.length) return;

        const containerDOM = $container[0];
        const $mainImage = $container.find(`.${CSS.GALLERY.MAIN_IMG}`);
        if (!$mainImage.length) return;

        const imageDOM = $mainImage[0];
        const containerRect = containerDOM.getBoundingClientRect();

        const boundedOffset = EnhancedZoom.enforceBoundariesEnhanced(
            state.imageOffset.x,
            state.imageOffset.y,
            state.zoomScale,
            containerRect,
            imageDOM
        );

        if (boundedOffset.x !== state.imageOffset.x || boundedOffset.y !== state.imageOffset.y) {
            const duration = 300;
            const startX = state.imageOffset.x;
            const startY = state.imageOffset.y;
            const deltaX = boundedOffset.x - startX;
            const deltaY = boundedOffset.y - startY;
            const startTime = performance.now();

            const animateToBoundary = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                state.imageOffset.x = startX + deltaX * easeProgress;
                state.imageOffset.y = startY + deltaY * easeProgress;

                EnhancedDrag.updateTransform();

                if (progress < 1) {
                    requestAnimationFrame(animateToBoundary);
                }
            };

            requestAnimationFrame(animateToBoundary);
        }
    },

    handleDoubleTap: (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const containerDOM = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`)[0];
        const rect = containerDOM.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        if (state.zoomScale > 1) {
            Zoom.resetZoom();
        } else {
            const newScale = 2.5;
            const imageX = (touchX - state.imageOffset.x) / state.zoomScale;
            const imageY = (touchY - state.imageOffset.y) / state.zoomScale;
            const newOffsetX = touchX - (imageX * newScale);
            const newOffsetY = touchY - (imageY * newScale);

            const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
            Zoom._applyTransition($container, () => {
                state.imageOffset.x = newOffsetX;
                state.imageOffset.y = newOffsetY;
                state.zoomScale = newScale;
                EnhancedDrag.updateTransform();
            });
        }
        state.lastTapTime = 0;
    },

    handlePinchStart: (e) => {
        e.preventDefault();
        state.pinchZoomActive = true;
        state.initialTouchDistance = Utils.getDistance(e.touches[0], e.touches[1]);
        state.initialScale = state.zoomScale;

        const containerDOM = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`)[0];
        const rect = containerDOM.getBoundingClientRect();
        const midPoint = Utils.getMidpoint(e.touches[0], e.touches[1]);
        state.zoomOrigin = { x: midPoint.x - rect.left, y: midPoint.y - rect.top };
    },

    handlePinchMove: (e) => {
        e.preventDefault();
        const currentDistance = Utils.getDistance(e.touches[0], e.touches[1]);
        if (state.initialTouchDistance === 0) return;

        const scaleFactor = currentDistance / state.initialTouchDistance;
        const newScale = Math.max(CONFIG.MIN_SCALE, Math.min(state.initialScale * scaleFactor, CONFIG.MAX_SCALE));

        const imageX = (state.zoomOrigin.x - state.imageOffset.x) / state.zoomScale;
        const imageY = (state.zoomOrigin.y - state.imageOffset.y) / state.zoomScale;

        state.imageOffset.x = state.zoomOrigin.x - (imageX * newScale);
        state.imageOffset.y = state.zoomOrigin.y - (imageY * newScale);
        state.zoomScale = newScale;

        EnhancedDrag.updateTransform();
    }
};

const EnhancedZoom = {
    initializeImageWithFillHeight: (imageDOM, containerDOM) => {
        if (!imageDOM || !containerDOM) return;
        $(imageDOM).css({
            maxWidth: '100%',
            maxHeight: '100vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto'
        });
        state.zoomScale = 1;
        state.imageOffset = { x: 0, y: 0 };
        Zoom.applyZoom();
    },

    enforceBoundariesEnhanced: (offsetX, offsetY, scale, containerRect, imageDOM) => {
        if (!imageDOM || !containerRect) return { x: offsetX, y: offsetY };

        const imgWidth = imageDOM.naturalWidth * scale;
        const imgHeight = imageDOM.naturalHeight * scale;
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;

        if (imgWidth <= containerWidth) {
            offsetX = (containerWidth - imgWidth) / 2;
        } else {
            const maxX = (imgWidth - containerWidth) / 2;
            const minX = -maxX;
            if (offsetX > maxX) offsetX = maxX + ((offsetX - maxX) * CONFIG.PAN_RESISTANCE / scale);
            else if (offsetX < minX) offsetX = minX - ((minX - offsetX) * CONFIG.PAN_RESISTANCE / scale);
        }

        if (imgHeight <= containerHeight) {
            offsetY = (containerHeight - imgHeight) / 2;
        } else {
            const maxY = (imgHeight - containerHeight) / 2;
            const minY = -maxY;
            if (offsetY > maxY) offsetY = maxY + ((offsetY - maxY) * CONFIG.PAN_RESISTANCE / scale);
            else if (offsetY < minY) offsetY = minY - ((minY - offsetY) * CONFIG.PAN_RESISTANCE / scale);
        }

        return { x: offsetX, y: offsetY };
    }
};

const EnhancedGallery = {
    showExpandedViewEnhanced: function(index) {
        if (!galleryOverlay || !galleryOverlay.length || index < 0 || index >= state.fullSizeImageSrcs.length) return;

        const $mainMediaContainer = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        const $counter = galleryOverlay.find(`.${CSS.GALLERY.COUNTER}`);
        const $prevButton = galleryOverlay.find(`.${CSS.GALLERY.PREV}`);
        const $nextButton = galleryOverlay.find(`.${CSS.GALLERY.NEXT}`);
        const $thumbnailStrip = galleryOverlay.find(`.${CSS.GALLERY.THUMBNAIL_STRIP}`);
        const $zoomControls = galleryOverlay.find('.zoom-controls');
        const $resetBtn = galleryOverlay.find('#reset-btn');

        if (!$mainMediaContainer.length || !$counter.length) return;

        state.currentGalleryIndex = index;
        const mediaItem = state.fullSizeImageSrcs[index];

        if (!mediaItem) {
            $mainMediaContainer.empty().append(
                $('<div>').addClass(CSS.GALLERY.IMAGE_ERROR_MSG).text('Media not available')
            );
            $counter.text(`${index + 1} / ${state.fullSizeImageSrcs.length}`);
            Gallery._preloadAdjacentImages(index);
            return;
        }

        $mainMediaContainer.empty();
        $mainMediaContainer.removeClass(CSS.GALLERY.ZOOMED).css({
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        });

        Zoom.resetZoom();

        if (mediaItem.type === 'image') {
            $zoomControls.show();
            $resetBtn.show();
            $mainMediaContainer.css('cursor', 'grab');

            const $mainImage = $('<img>').addClass(CSS.GALLERY.MAIN_IMG).appendTo($mainMediaContainer);

            $mainImage.css({
                maxWidth: '100%',
                maxHeight: '100vh',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
                position: 'relative'
            });

            $mainImage.addClass('loading').removeClass('error');

            $mainImage.off('load error').on('load', () => {
                $mainImage.removeClass('loading');
                EnhancedZoom.initializeImageWithFillHeight($mainImage[0], $mainMediaContainer[0]);
                Gallery._preloadAdjacentImages(index);
                TouchGestures.init();
                PreloadManager.preloadAdjacent(index);
            }).on('error', () => {
                $mainImage.removeClass('loading').addClass('error').attr({
                    src: '',
                    alt: "Error loading image"
                });
                $mainMediaContainer.append(
                    $('<div>').addClass(CSS.GALLERY.IMAGE_ERROR_MSG).text('Failed to load image')
                );
                Gallery._preloadAdjacentImages(index);
            });

            let imageUrlToLoad = Gallery._preloadedImageCache[index] || mediaItem.src;
            $mainImage.attr({
                src: imageUrlToLoad,
                alt: `Image ${index + 1}`
            });

        } else if (mediaItem.type === 'video') {
            $zoomControls.hide();
            $resetBtn.hide();
            $mainMediaContainer.css('cursor', 'default');

            const $mainVideo = $('<video>').addClass(CSS.GALLERY.MAIN_VIDEO).appendTo($mainMediaContainer);
            $mainVideo.attr({
                src: mediaItem.src,
                poster: mediaItem.poster,
                controls: true,
                autoplay: true,
                loop: true,
                muted: true
            });
        }

        $counter.text(`${index + 1} / ${state.fullSizeImageSrcs.length}`);

        galleryOverlay.find(`.${CSS.GALLERY.GRID_VIEW}`).addClass(CSS.GALLERY.HIDE);
        galleryOverlay.find(`.${CSS.GALLERY.EXPANDED_VIEW}`).removeClass(CSS.GALLERY.HIDE);
        $counter.removeClass(CSS.GALLERY.HIDE);

        if ($thumbnailStrip.length) {
            $thumbnailStrip.find(`.${CSS.GALLERY.THUMBNAIL_ITEM}.selected`).removeClass('selected');
            const $currentThumbInStrip = $thumbnailStrip.find(`.${CSS.GALLERY.THUMBNAIL_ITEM}[data-index="${index}"]`);

            if ($currentThumbInStrip.length) {
                $currentThumbInStrip.addClass('selected');
                const stripWidth = $thumbnailStrip.width();
                const thumbOffsetLeft = $currentThumbInStrip[0].offsetLeft;
                const thumbWidth = $currentThumbInStrip.outerWidth();
                $thumbnailStrip.scrollLeft(thumbOffsetLeft - (stripWidth / 2) + (thumbWidth / 2));
            }
        }

        if (!state.hideNavArrows && $prevButton.length && $nextButton.length) {
            $prevButton.toggleClass(CSS.GALLERY.HIDE, index === 0);
            $nextButton.toggleClass(CSS.GALLERY.HIDE, index === state.fullSizeImageSrcs.length - 1);
        }

        state.controlsVisible = true;
    }
};

const EnhancedImageLoader = {
    imageActionsEnhanced: {
        height: ImageSizing.applyFillHeight,
        width: ImageSizing.applyFillWidth,
        full: ImageSizing.applyFullSize
    },

    applyDefaultSizingToLoadedImages: () => {
        document.querySelectorAll('img.post__image.ug-image-loaded').forEach(img => {
            ImageSizing.applyFillHeight(img);
        });
    }
};

const LazyLoader = {
    observer: null,
    init: () => {
        if ('IntersectionObserver' in window) {
            LazyLoader.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        if (src) {
                            img.src = src;
                            img.classList.remove('lazy');
                            LazyLoader.observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });
        }
    },
    observe: (img) => {
        if (LazyLoader.observer) LazyLoader.observer.observe(img);
    },
    unobserve: (img) => {
        if (LazyLoader.observer) LazyLoader.observer.unobserve(img);
    }
};

const PreloadManager = {
    queue: [],
    loading: new Set(),
    maxConcurrent: 3,

    addToQueue: (url, priority = 0) => {
        // Avoid caching check here since we aren't using loadedBlobs RAM cache.
        // Dexie check happens in fetchWithRetry.
        if (PreloadManager.queue.some(item => item.url === url) ||
            PreloadManager.loading.has(url)) {
            return;
        }

        PreloadManager.queue.push({ url, priority });
        PreloadManager.queue.sort((a, b) => b.priority - a.priority);
        PreloadManager.processQueue();
    },

    processQueue: async () => {
        if (PreloadManager.loading.size >= PreloadManager.maxConcurrent ||
            PreloadManager.queue.length === 0) {
            return;
        }

        const { url } = PreloadManager.queue.shift();
        PreloadManager.loading.add(url);

        try {
            // fetchWithRetry now handles DB storage internally
            await ImageLoader.fetchWithRetry(url, state.currentLoadSessionId);
        } catch (error) {
            console.warn('Failed to preload:', url, error);
        } finally {
            PreloadManager.loading.delete(url);
            setTimeout(() => PreloadManager.processQueue(), 100);
        }
    },

    preloadAdjacent: (currentIndex) => {
        for (let i = 1; i <= 3; i++) {
            const nextIndex = currentIndex + i;
            if (nextIndex < state.originalImageSrcs.length) {
                const item = state.originalImageSrcs[nextIndex];
                if (item && item.src) {
                    PreloadManager.addToQueue(item.src, 3 - i);
                }
            }
        }
        const prevIndex = currentIndex - 1;
        if (prevIndex >= 0) {
            const item = state.originalImageSrcs[prevIndex];
            if (item && item.src) {
                PreloadManager.addToQueue(item.src, 1);
            }
        }
    },

    clearQueue: () => {
        PreloadManager.queue = [];
        PreloadManager.loading.clear();
    }
};

const TouchGestures = {
    init: () => {
        const container = document.querySelector('.ug-main-image-container');
        if (!container) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let lastTouchX = 0;
        let lastTouchY = 0;
        let isSwiping = false;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
                touchStartTime = Date.now();
                isSwiping = false;
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - lastTouchX;
                const deltaY = touch.clientY - lastTouchY;

                if (!isSwiping && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
                    isSwiping = true;
                }

                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
            }
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 1 && isSwiping) {
                const touch = e.changedTouches[0];
                const touchEndX = touch.clientX;
                const touchEndTime = Date.now();

                const deltaX = touchEndX - touchStartX;
                const deltaTime = touchEndTime - touchStartTime;

                const minSwipeDistance = 50;
                const maxSwipeTime = 300;

                if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
                    if (deltaX > 0) {
                        Gallery.prevImage();
                    } else {
                        Gallery.nextImage();
                    }
                }
            }
        }, { passive: true });
    }
};

const Slideshow = {
    interval: null,
    isActive: false,
    delay: 3000,
    pauseOnHover: true,

    init: () => {
        Slideshow.delay = SettingsManager.loadSetting('slideshowDelay', 3000);
        Slideshow.pauseOnHover = SettingsManager.loadSetting('slideshowPauseOnHover', true);
    },

    start: () => {
        if (Slideshow.isActive) return;

        Slideshow.isActive = true;
        state.isSlideshowActive = true;

        Slideshow.interval = setInterval(() => {
            Gallery.nextImage();
        }, Slideshow.delay);

        Slideshow.showIndicator();

        if (Slideshow.pauseOnHover) {
            galleryOverlay.on('mouseenter.slideshow', () => Slideshow.pause());
            galleryOverlay.on('mouseleave.slideshow', () => Slideshow.resume());
        }

        Accessibility.announce('Slideshow started');
        state.notification = 'Slideshow started';
        state.notificationType = 'info';
    },

    stop: () => {
        if (!Slideshow.isActive) return;

        Slideshow.isActive = false;
        state.isSlideshowActive = false;

        if (Slideshow.interval) {
            clearInterval(Slideshow.interval);
            Slideshow.interval = null;
        }

        Slideshow.hideIndicator();
        galleryOverlay.off('.slideshow');

        Accessibility.announce('Slideshow stopped');
        state.notification = 'Slideshow stopped';
        state.notificationType = 'info';
    },

    pause: () => {
        if (Slideshow.interval && Slideshow.isActive) {
            clearInterval(Slideshow.interval);
            Slideshow.interval = null;
            Slideshow.updateIndicator(true);
        }
    },

    resume: () => {
        if (!Slideshow.interval && Slideshow.isActive) {
            Slideshow.interval = setInterval(() => {
                Gallery.nextImage();
            }, Slideshow.delay);
            Slideshow.updateIndicator(false);
        }
    },

    toggle: () => {
        if (Slideshow.isActive) {
            Slideshow.stop();
        } else {
            Slideshow.start();
        }
    },

    showIndicator: () => {
        const $indicator = $('<div>')
            .addClass('ug-slideshow-indicator')
            .html(`
                <span class="ug-slideshow-icon">▶</span>
                <span class="ug-slideshow-text">Slideshow</span>
                <button class="ug-slideshow-stop" title="Stop slideshow">✕</button>
            `);

        galleryOverlay.find('.ug-gallery-toolbar').append($indicator);

        $indicator.find('.ug-slideshow-stop').on('click', (e) => {
            e.stopPropagation();
            Slideshow.stop();
        });
    },

    hideIndicator: () => {
        galleryOverlay.find('.ug-slideshow-indicator').remove();
    },

    updateIndicator: (isPaused) => {
        const $indicator = galleryOverlay.find('.ug-slideshow-indicator');
        const $icon = $indicator.find('.ug-slideshow-icon');

        if (isPaused) {
            $icon.text('❚❚');
            $indicator.addClass('paused');
        } else {
            $icon.text('▶');
            $indicator.removeClass('paused');
        }
    },

    setDelay: (delay) => {
        Slideshow.delay = delay;
        SettingsManager.saveSetting('slideshowDelay', delay);

        if (Slideshow.isActive) {
            Slideshow.stop();
            Slideshow.start();
        }
    }
};

const ErrorHandler = {
    retryAttempts: new Map(),

    handleImageError: async (error, url, element = null, context = {}) => {
        const retryCount = ErrorHandler.retryAttempts.get(url) || 0;

        console.error(`Image load error (${retryCount + 1}/${CONFIG.MAX_RETRIES}):`, error, url);

        if (retryCount < CONFIG.MAX_RETRIES) {
            ErrorHandler.retryAttempts.set(url, retryCount + 1);
            const delay = Math.pow(2, retryCount) * 1000;

            if (retryCount === 0) {
                state.notification = `Retrying failed image... (${retryCount + 1}/${CONFIG.MAX_RETRIES})`;
                state.notificationType = 'warning';
            }

            setTimeout(async () => {
                try {
                    if (element) {
                        element.classList.add('retrying');
                    }
                    // fetchWithRetry handles db caching
                    const blob = await ImageLoader.fetchWithRetry(url, state.currentLoadSessionId);

                    if (blob && element) {
                        const blobUrl = BlobManager.createUrl(blob);
                        element.src = blobUrl;
                        element.classList.remove('error', 'retrying');
                        ErrorHandler.retryAttempts.delete(url);

                        state.notification = 'Image loaded successfully';
                        state.notificationType = 'success';
                    }
                } catch (retryError) {
                    ErrorHandler.handleImageError(retryError, url, element, context);
                }
            }, delay);
        } else {
            ErrorHandler.showErrorPlaceholder(element, url, context);
            ErrorHandler.retryAttempts.delete(url);

            state.notification = `Failed to load image after ${CONFIG.MAX_RETRIES} attempts`;
            state.notificationType = 'error';
        }
    },

    showErrorPlaceholder: (element, url, context) => {
        if (!element) return;
        const errorSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        `;
        const errorContainer = document.createElement('div');
        errorContainer.className = 'ug-error-container';
        errorContainer.innerHTML = `
            <div class="ug-error-icon">${errorSvg}</div>
            <div class="ug-error-message">Failed to load image</div>
            <button class="ug-error-retry" title="Retry loading">Retry</button>
        `;
        if (element.parentNode) {
            element.parentNode.replaceChild(errorContainer, element);
        }
        errorContainer.querySelector('.ug-error-retry').addEventListener('click', () => {
            if (element.parentNode) {
                errorContainer.parentNode.replaceChild(element, errorContainer);
            }
            element.classList.add('loading');
            ErrorHandler.retryAttempts.delete(url);
            ImageLoader.loadImageAndApplyToPage(
                context.linkElement,
                context.galleryIndex,
                context.posterHref,
                context.isUniqueForGallery,
                state.currentLoadSessionId,
                context.itemData
            );
        });
    },

    clearRetries: () => {
        ErrorHandler.retryAttempts.clear();
    }
};

const SettingsManager = {
    defaultSettings: {
        galleryKey: 'g',
        prevImageKey: 'k',
        nextImageKey: 'l',
        zoomEnabled: true,
        animationsEnabled: true,
        notificationsEnabled: true,
        notificationPosition: 'bottom',
        bottomStripeVisible: true,
        hideNavArrows: false,
        hideRemoveButton: false,
        hideFullButton: false,
        hideDownloadButton: false,
        hideHeightButton: false,
        hideWidthButton: false,
        enablePersistentCaching: true,
        optimizePngInZip: false,
        slideshowDelay: 3000,
        slideshowPauseOnHover: true,
        inertiaEnabled: true,
        maxZoomScale: 5,
        zipFileNameFormat: '{title}-{artistName}.zip',
        imageFileNameFormat: '{title}-{artistName}-{fileName}-{index}'
    },

    saveSetting: (key, value) => {
        try {
            GM_setValue(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Failed to save setting:', key, error);
            return false;
        }
    },

    loadSetting: (key, defaultValue = null) => {
        try {
            const value = GM_getValue(key);
            return value !== undefined ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('Failed to load setting:', key, error);
            return defaultValue;
        }
    },

    loadAllSettings: () => {
        const settings = {};
        Object.keys(SettingsManager.defaultSettings).forEach(key => {
            settings[key] = SettingsManager.loadSetting(key, SettingsManager.defaultSettings[key]);
        });
        return settings;
    },

    saveAllSettings: (settings) => {
        let success = true;
        Object.keys(settings).forEach(key => {
            if (!SettingsManager.saveSetting(key, settings[key])) {
                success = false;
            }
        });
        return success;
    },

    resetToDefaults: () => {
        return SettingsManager.saveAllSettings(SettingsManager.defaultSettings);
    },

    exportSettings: () => {
        const settings = SettingsManager.loadAllSettings();
        return JSON.stringify(settings, null, 2);
    },

    importSettings: (settingsJson) => {
        try {
            const settings = JSON.parse(settingsJson);
            const validatedSettings = {};
            Object.keys(SettingsManager.defaultSettings).forEach(key => {
                if (settings.hasOwnProperty(key)) {
                    validatedSettings[key] = settings[key];
                } else {
                    validatedSettings[key] = SettingsManager.defaultSettings[key];
                }
            });
            if (SettingsManager.saveAllSettings(validatedSettings)) {
                Object.assign(state, validatedSettings);
                state.notification = 'Settings imported successfully';
                state.notificationType = 'success';
                return true;
            }
        } catch (error) {
            console.error('Failed to import settings:', error);
            state.notification = 'Failed to import settings: Invalid format';
            state.notificationType = 'error';
        }
        return false;
    },

    updateSetting: (key, value) => {
        if (SettingsManager.saveSetting(key, value)) {
            state[key] = value;
            return true;
        }
        return false;
    }
};

const Accessibility = {
    init: () => {
        if (galleryOverlay) {
            galleryOverlay.attr({
                'role': 'dialog',
                'aria-modal': 'true',
                'aria-label': 'Image Gallery'
            });
        }
        const $liveRegion = $('<div>').attr({
            'aria-live': 'polite',
            'aria-atomic': 'true',
            'class': 'ug-sr-only'
        });
        $('body').append($liveRegion);
    },

    announce: (message) => {
        $('.ug-sr-only').text(message);
    }
};

const BlobManager = {
    blobUrls: new Set(),
    createUrl: (blob) => {
        if (!blob) return '';
        const url = URL.createObjectURL(blob);
        BlobManager.blobUrls.add(url);
        return url;
    },
    revokeUrl: (url) => {
        if (typeof url === 'string' && url.startsWith('blob:')) {
            try {
                URL.revokeObjectURL(url);
                BlobManager.blobUrls.delete(url);
            } catch (e) { /* silent */ }
        }
    },
    revokeAll: () => {
        BlobManager.blobUrls.forEach(url => {
            try { URL.revokeObjectURL(url); } catch (e) { /* silent */ }
        });
        BlobManager.blobUrls.clear();
    }
};

const StateManager = {
    generateSessionId: () => crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2),
    withSessionCheck: (callback) => {
        return (value, oldValue) => {
            if (state.currentLoadSessionId === null) return;
            callback(value, oldValue);
        };
    },
    createReactiveState: (initialState, updateCallbacks = {}) => {
        return new Proxy(initialState, {
            set(target, key, value) {
                const oldValue = target[key];
                target[key] = value;
                if (updateCallbacks[key]) {
                    updateCallbacks[key](value, oldValue);
                }
                return true;
            },
        });
    },
    getStoredValue: (key, defaultValue) => {
        try {
            return GM_getValue(key, defaultValue);
        } catch (e) {
            console.error(`Error getting stored value for ${key}:`, e);
            return defaultValue;
        }
    },
    setStoredValue: (key, value) => {
        try {
            GM_setValue(key, value);
        } catch (e) {
            console.error(`Error setting stored value for ${key}:`, e);
        }
    }
};

const state = StateManager.createReactiveState({
    zipFileNameFormat: SettingsManager.loadSetting('zipFileNameFormat', '{title}-{artistName}.zip'),
    imageFileNameFormat: SettingsManager.loadSetting('imageFileNameFormat', '{title}-{artistName}-{fileName}-{index}'),
    galleryKey: SettingsManager.loadSetting('galleryKey', 'g'),
    galleryReady: false,
    galleryActive: false,
    currentGalleryIndex: 0,
    isFullscreen: SettingsManager.loadSetting('isFullscreen', false),
    virtualGallery: [],
    originalImageSrcs: [],
    fullSizeImageSrcs: [],
    currentPostUrl: null,
    displayedImages: [],
    totalImages: 0,
    loadedImages: 0,
    downloadedCount: 0,
    isLoading: false,
    loadingMessage: null,
    hasImages: false,
    postActionsInitialized: false,
    mediaLoaded: {},
    isGalleryMode: false,
    isDownloading: false,
    errorCount: 0,
    currentLoadSessionId: null,
    notificationsEnabled: SettingsManager.loadSetting('notificationsEnabled', true),
    notificationAreaVisible: SettingsManager.loadSetting('notificationAreaVisible', true),
    notificationPosition: SettingsManager.loadSetting('notificationPosition', 'bottom'),
    animationsEnabled: SettingsManager.loadSetting('animationsEnabled', true),
    optimizePngInZip: SettingsManager.loadSetting('optimizePngInZip', false),
    enablePersistentCaching: SettingsManager.loadSetting('enablePersistentCaching', true),
    notification: null,
    notificationType: 'info',
    hideNavArrows: SettingsManager.loadSetting('hideNavArrows', false),
    hideRemoveButton: SettingsManager.loadSetting('hideRemoveButton', false),
    hideFullButton: SettingsManager.loadSetting('hideFullButton', false),
    hideDownloadButton: SettingsManager.loadSetting('hideDownloadButton', false),
    hideHeightButton: SettingsManager.loadSetting('hideHeightButton', false),
    hideWidthButton: SettingsManager.loadSetting('hideWidthButton', false),
    settingsOpen: false,
    prevImageKey: SettingsManager.loadSetting('prevImageKey', 'k'),
    nextImageKey: SettingsManager.loadSetting('nextImageKey', 'l'),
    bottomStripeVisible: SettingsManager.loadSetting('bottomStripeVisible', true),
    dynamicResizing: SettingsManager.loadSetting('dynamicResizing', true),
    zoomEnabled: SettingsManager.loadSetting('zoomEnabled', true),
    isZoomed: false,
    zoomScale: 1,
    controlsVisible: true,
    isDragging: false,
    dragStartPosition: { x: 0, y: 0 },
    lastMousePosition: { x: 0, y: 0 },
    imageOffset: { x: 0, y: 0 },
    lastWidth: 0,
    lastHeight: 0,
    zoomOrigin: { x: 0, y: 0 },
    dragStartOffset: { x: 0, y: 0 },
    pendingRetries: {},
    lastTapTime: 0,
    pinchZoomActive: false,
    initialTouchDistance: 0,
    initialScale: 1,
    zoomIndicatorVisible: true,
    inertiaEnabled: SettingsManager.loadSetting('inertiaEnabled', true),
    velocity: { x: 0, y: 0 },
    inertiaActive: false,
    isSlideshowActive: false,
}, {
    controlsVisible: (value) => {
        if (galleryOverlay && galleryOverlay.length) {
            const $toolbar = galleryOverlay.find(`.${CSS.GALLERY.TOOLBAR}`);
            if ($toolbar.length) {
                $toolbar.toggleClass(CSS.GALLERY.CONTROLS_HIDDEN, !value);
            }
        }
    },
    galleryReady: (value) => {
        updateGalleryButton(value);
    },
    loadedImages: StateManager.withSessionCheck((value) => {
        if (value === state.totalImages && state.totalImages > 0) {
            state.notificationType = 'success';
            state.notification = `Media Done Loading! Total: ${state.totalImages}`;
        } else if (state.totalImages > 0) {
            state.notificationType = 'info';
            state.notification = `Loading media (${value}/${state.totalImages})...`;
        }
    }),
    downloadedCount: (value) => {
        if (value === state.totalImages) {
            state.notificationType = 'success';
            state.notification = `All files ready for zipping!`;
        } else {
            state.notificationType = 'info';
            state.notification = `Preparing... (${value}/${state.totalImages})`;
        }
    },
    totalImages: StateManager.withSessionCheck((value, oldValue) => {
        if (value > 0) {
            state.notificationType = 'info';
            state.notification = `Loading media (${state.loadedImages}/${value})...`;
        }
        state.hasImages = value > 0;
    }),
    isLoading: (value, oldValue) => {
        if (value && !oldValue) {
            if ((state.galleryActive || state.isDownloading) && state.loadedImages === 0) {
                UI.showLoadingOverlay(state.loadingMessage);
            }
        } else if (!value && oldValue) {
            UI.hideLoadingOverlay();
        }
    },
    loadingMessage: (value) => {
        if (state.isLoading && (state.galleryActive || state.isDownloading)) {
            UI.updateLoadingOverlayText(value);
        }
    },
    notification: (value) => {
        if (value) {
            UI.showNotification(value, state.notificationType);
        } else {
            UI.hideNotification();
        }
    },
    settingsOpen: (value) => {
        if (value) {
            UI.showSettings();
        } else {
            UI.closeSettings();
        }
    },
    isFullscreen: (value) => {
        SettingsManager.saveSetting('isFullscreen', value);
        if (value) {
            if (galleryOverlay && galleryOverlay.length) {
                document.body.classList.add('ug-fullscreen');
                galleryOverlay.addClass(CSS.GALLERY.FULLSCREEN_OVERLAY);
            }
        } else {
            document.body.classList.remove('ug-fullscreen');
            if (galleryOverlay && galleryOverlay.length) {
                galleryOverlay.removeClass(CSS.GALLERY.FULLSCREEN_OVERLAY);
            }
        }
    },
    zoomEnabled: (value) => {
        SettingsManager.saveSetting('zoomEnabled', value);
    },
    bottomStripeVisible: (value) => {
        SettingsManager.saveSetting('bottomStripeVisible', value);
        if (galleryOverlay) {
            const stripContainer = galleryOverlay.querySelector(`.${CSS.GALLERY.STRIP_CONTAINER}`);
            if (stripContainer) {
                stripContainer.style.display = value ? 'flex' : 'none';
            }
        }
    },
    zoomScale: (value, oldValue) => {
        Zoom.applyZoom();
        if (galleryOverlay && galleryOverlay.length) {
            const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
            if ($container.length) {
                $container.toggleClass(CSS.GALLERY.ZOOMED, value > 1);
                $container.css('cursor', value > 1 ? 'grab' : 'default');
            }
            if (value > 1 && oldValue === 1 && state.zoomIndicatorVisible) {
                const tooltip = Utils.createTooltip('Click and drag to pan image');
                galleryOverlay.append(tooltip);
                state.zoomIndicatorVisible = false;
            }
        }
    },
    imageOffset: () => Zoom.applyZoom(),
    isDragging: (value) => {
        if (galleryOverlay && galleryOverlay.length) {
            const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
            if ($container.length) {
                $container.toggleClass(CSS.GALLERY.GRABBING, value);
                if (value && state.inertiaActive) {
                    state.inertiaActive = false;
                    state.velocity = { x: 0, y: 0 };
                    if (state.inertiaAnimFrame) {
                        cancelAnimationFrame(state.inertiaAnimFrame);
                        state.inertiaAnimFrame = null;
                    }
                }
            }
        }
    },
    notificationPosition: (value) => {
        SettingsManager.saveSetting('notificationPosition', value);
        const notifArea = document.getElementById(CSS.NOTIF_AREA);
        if (notifArea) {
            notifArea.style.top = value === 'top' ? '10px' : 'auto';
            notifArea.style.bottom = value === 'bottom' ? '10px' : 'auto';
        }
    },
    enablePersistentCaching: (value) => {
        SettingsManager.saveSetting('enablePersistentCaching', value);
        if (value && !db) {
            initDexie();
        }
    },
    optimizePngInZip: (value) => {
        SettingsManager.saveSetting('optimizePngInZip', value);
    },
});

const ResourceLoader = {
    loadedUPNG: null,
    loadedPako: null,
    async loadResourceScript(resourceName, expectedGlobal) {
        if (window[expectedGlobal]) return window[expectedGlobal];
        try {
            const scriptText = GM_getResourceText(resourceName);
            if (!scriptText) return null;
            (0, eval)(scriptText);
            return window[expectedGlobal];
        } catch (e) {
            return null;
        }
    },
    async init() {
        if (!ResourceLoader.loadedPako) {
            ResourceLoader.loadedPako = await ResourceLoader.loadResourceScript('pakoJsRaw', 'pako');
        }
    }
};

// ====================================================
// Dexie Database (IndexedDB)
// ====================================================
let db = null;

function initDexie() {
    if (typeof Dexie === 'undefined') return false;
    db = new Dexie('UltraGalleriesCache');
    db.version(1).stores({
        imageCache: 'url, cachedAt, blob'
    });
    return true;
}

async function evictOldestCacheItems(count) {
    if (!db) return 0;
    try {
        const oldestItemKeys = await db.imageCache.orderBy('cachedAt').limit(count).primaryKeys();
        if (oldestItemKeys && oldestItemKeys.length > 0) {
            await db.imageCache.bulkDelete(oldestItemKeys);
            return oldestItemKeys.length;
        }
        return 0;
    } catch (e) {
        return 0;
    }
}

async function storeImageInDexie(url, blob) {
    if (!db) return;
    try {
        await db.imageCache.put({ url: url, blob: blob, cachedAt: Date.now() });
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            const evictedCount = await evictOldestCacheItems(CONFIG.CACHE_EVICTION_COUNT);
            if (evictedCount > 0) {
                try {
                    await db.imageCache.put({ url: url, blob: blob, cachedAt: Date.now() });
                } catch (retryError) { /* silent */ }
            }
        }
    }
}

async function getImageFromDexie(url) {
    if (!db) return null;
    try {
        const record = await db.imageCache.get(url);
        return record && record.blob ? record.blob : null;
    } catch (e) {
        return null;
    }
}

async function clearDexieCache() {
    if (!db) return;
    try {
        await db.imageCache.clear();
        state.notification = "Persistent image cache cleared.";
        state.notificationType = "success";
    } catch (e) {
        state.notification = "Error clearing cache.";
        state.notificationType = "error";
    }
}

const Zoom = {
    _applyTransition: function ($element, action) {
        $element.addClass(CSS.GALLERY.IS_TRANSITIONING);
        action();
        $element.one('transitionend', () => {
            $element.removeClass(CSS.GALLERY.IS_TRANSITIONING);
        });
    },

    applyZoom: () => {
        if (!galleryOverlay || !galleryOverlay.length) return;
        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if (!$container.length) return;
        EnhancedDrag.updateTransform();
        const $zoomDisplay = galleryOverlay.find('#zoom-level');
        if ($zoomDisplay.length) {
            $zoomDisplay.text(`${Math.round(state.zoomScale * 100)}%`);
        }
        $container.toggleClass(CSS.GALLERY.ZOOMED, state.zoomScale !== 1);
    },

    handleWheelZoom: (event) => {
        if (!state.zoomEnabled || !galleryOverlay || !galleryOverlay.length) return;
        event.preventDefault();
        event.stopPropagation();
        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if (!$container.length) return;
        const containerDOM = $container[0];
        $container.css('transform-origin', '0 0');
        const rect = containerDOM.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const originalEvent = event.originalEvent || event;
        const mouseX = originalEvent.clientX - rect.left;
        const mouseY = originalEvent.clientY - rect.top;
        const delta = originalEvent.deltaY;
        const zoomFactor = delta > 0 ? (1 - CONFIG.ZOOM_STEP) : (1 + CONFIG.ZOOM_STEP);
        const newScale = Math.max(CONFIG.MIN_SCALE, Math.min(state.zoomScale * zoomFactor, CONFIG.MAX_SCALE));
        if (newScale === state.zoomScale) return;
        const imageXUnderPointer = (mouseX - state.imageOffset.x) / state.zoomScale;
        const imageYUnderPointer = (mouseY - state.imageOffset.y) / state.zoomScale;
        const newOffsetX = mouseX - (imageXUnderPointer * newScale);
        const newOffsetY = mouseY - (imageYUnderPointer * newScale);
        state.imageOffset.x = newOffsetX;
        state.imageOffset.y = newOffsetY;
        state.zoomScale = newScale;
    },

    enforceBoundaries: (offsetX, offsetY, scale, containerRect, imageDOM) => {
        return EnhancedZoom.enforceBoundariesEnhanced(offsetX, offsetY, scale, containerRect, imageDOM);
    },

    startDrag: (event) => EnhancedDrag.startDrag(event),
    dragImage: (event) => EnhancedDrag.dragImage(event),
    endDrag: () => EnhancedDrag.endDrag(),

    resetZoom: () => {
        if (!galleryOverlay || !galleryOverlay.length) return;
        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if ($container.length) {
            Zoom._applyTransition($container, () => {
                state.zoomScale = 1;
                state.imageOffset = { x: 0, y: 0 };
                Zoom.applyZoom();
            });
        }
    },

    initializeImage: (imageDOM, containerDOM) => {
        return EnhancedZoom.initializeImageWithFillHeight(imageDOM, containerDOM);
    },

    zoom: (step) => {
        if (!galleryOverlay || !galleryOverlay.length) return;
        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if (!$container.length) return;
        const containerDOM = $container[0];
        const rect = containerDOM.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const newScale = Math.max(CONFIG.MIN_SCALE, Math.min(state.zoomScale + step, CONFIG.MAX_SCALE));
        if (state.zoomScale !== newScale) {
            const imageX = (centerX - state.imageOffset.x) / state.zoomScale;
            const imageY = (centerY - state.imageOffset.y) / state.zoomScale;
            const newOffsetX = centerX - (imageX * newScale);
            const newOffsetY = centerY - (imageY * newScale);
            Zoom._applyTransition($container, () => {
                state.imageOffset.x = newOffsetX;
                state.imageOffset.y = newOffsetY;
                state.zoomScale = newScale;
                Zoom.applyZoom();
            });
        }
    },

    setupTouchEvents: () => {
        if (!galleryOverlay || !galleryOverlay.length) return;
        const $container = galleryOverlay.find(`.${CSS.GALLERY.MAIN_IMG_CONTAINER}`);
        if (!$container.length) return;
        const containerDOM = $container[0];
        let longPressTimer = null;

        const handleTouchStart = (e) => {
            const currentItem = state.fullSizeImageSrcs[state.currentGalleryIndex];
            if (!currentItem || currentItem.type !== 'image') return;
            clearTimeout(longPressTimer);
            if (e.touches.length === 1) {
                const now = Date.now();
                if (now - state.lastTapTime < CONFIG.DOUBLE_TAP_THRESHOLD) {
                    EnhancedDrag.handleDoubleTap(e);
                    return;
                }
                state.lastTapTime = now;
                longPressTimer = setTimeout(() => $(e.target).addClass(CSS.LONG_PRESS), 500);
                EnhancedDrag.startDrag(e.touches[0]);
            } else if (e.touches.length === 2) {
                if (EnhancedDrag.isDragging) EnhancedDrag.endDrag();
                EnhancedDrag.handlePinchStart(e);
            }
        };

        const handleTouchMove = (e) => {
            const currentItem = state.fullSizeImageSrcs[state.currentGalleryIndex];
            if (!currentItem || currentItem.type !== 'image') return;
            clearTimeout(longPressTimer);
            if (state.pinchZoomActive && e.touches.length === 2) {
                EnhancedDrag.handlePinchMove(e);
            } else if (EnhancedDrag.isDragging && e.touches.length === 1) {
                if (!EnhancedDrag.touchMoveThrottled) {
                    EnhancedDrag.touchMoveThrottled = true;
                    EnhancedDrag.dragImage(e.touches[0]);
                    requestAnimationFrame(() => {
                        EnhancedDrag.touchMoveThrottled = false;
                    });
                }
            }
        };

        const handleTouchEnd = (e) => {
            clearTimeout(longPressTimer);
            $container.find(`.${CSS.LONG_PRESS}`).removeClass(CSS.LONG_PRESS);
            if (state.pinchZoomActive && e.touches.length < 2) {
                state.pinchZoomActive = false;
            }
            if (EnhancedDrag.isDragging) {
                EnhancedDrag.endDrag();
            }
        };

        const eventOptions = { passive: false };
        containerDOM.addEventListener('touchstart', handleTouchStart, eventOptions);
        containerDOM.addEventListener('touchmove', handleTouchMove, eventOptions);
        containerDOM.addEventListener('touchend', handleTouchEnd, eventOptions);
        containerDOM.addEventListener('touchcancel', handleTouchEnd, eventOptions);
    }
};

const ThumbnailStrip = {
    init: () => {
        if (!galleryOverlay) return;
        const $strip = galleryOverlay.find('.ug-thumbnail-strip');
        ThumbnailStrip.updateScrollIndicators();
        ThumbnailStrip.setupKeyboardNavigation();
        ThumbnailStrip.setupDragNavigation();
        ThumbnailStrip.setupHoverPreview();
        ThumbnailStrip.setupContextMenu();
        $strip.on('scroll', Utils.throttle(() => {
            ThumbnailStrip.updateScrollIndicators();
        }, 100));
    },
    updateScrollIndicators: () => {
        const $strip = galleryOverlay.find('.ug-thumbnail-strip');
        const hasScroll = $strip[0].scrollWidth > $strip[0].clientWidth;
        $strip.toggleClass('no-scroll', !hasScroll);
    },
    setupKeyboardNavigation: () => {
        const $strip = galleryOverlay.find('.ug-thumbnail-strip');
        $strip.on('keydown', (e) => {
            const $focused = $(e.target);
            if (!$focused.hasClass('ug-thumbnail')) return;
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    ThumbnailStrip.navigateThumbnails('prev');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    ThumbnailStrip.navigateThumbnails('next');
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    const index = parseInt($focused.data('index'));
                    Gallery.showExpandedView(index);
                    break;
            }
        });
    },
    navigateThumbnails: (direction) => {
        const $strip = galleryOverlay.find('.ug-thumbnail-strip');
        const $current = $strip.find('.ug-thumbnail.selected');
        const $target = direction === 'next' ? $current.next() : $current.prev();
        if ($target.length) {
            $target[0].focus();
            $target[0].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    },
    setupDragNavigation: () => {
        const $strip = galleryOverlay.find('.ug-thumbnail-strip');
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        $strip.on('mousedown', (e) => {
            if (e.button !== 0) return;
            if (e.target.closest('.ug-thumbnail')) return;
            isDragging = true;
            startX = e.pageX - $strip.offset().left;
            scrollLeft = $strip.scrollLeft();
            $strip.css('cursor', 'grabbing');
            $strip.addClass('ug-dragging');
        });
        $(document).on('mousemove.thumbnailstrip', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - $strip.offset().left;
            const walk = (x - startX) * 2;
            $strip.scrollLeft(scrollLeft - walk);
        });
        $(document).on('mouseup.thumbnailstrip', () => {
            isDragging = false;
            $strip.css('cursor', '');
            $strip.removeClass('ug-dragging');
        });
    },
    setupHoverPreview: () => {
        const $strip = galleryOverlay.find('.ug-thumbnail-strip');
        let previewTimeout;
        $strip.on('mouseenter', '.ug-thumbnail', function() {
            const $thumb = $(this);
            const index = parseInt($thumb.data('index'));
            clearTimeout(previewTimeout);
            previewTimeout = setTimeout(() => {
                ThumbnailStrip.showZoomPreview($thumb, index);
            }, 500);
        });
        $strip.on('mouseleave', '.ug-thumbnail', function() {
            clearTimeout(previewTimeout);
            ThumbnailStrip.hideZoomPreview();
        });
    },
    showZoomPreview: ($thumb, index) => {
        const mediaItem = state.fullSizeImageSrcs[index];
        if (!mediaItem || mediaItem.type !== 'image') return;
        const $preview = $('<div>').addClass('ug-thumbnail-zoom-preview');
        $('<img>').attr('src', mediaItem.src).appendTo($preview);
        $thumb.append($preview);
        setTimeout(() => $preview.addClass('show'), 10);
    },
    hideZoomPreview: () => {
        galleryOverlay.find('.ug-thumbnail-zoom-preview').removeClass('show');
        setTimeout(() => {
            galleryOverlay.find('.ug-thumbnail-zoom-preview').remove();
        }, 300);
    },
    setupContextMenu: () => {
        const $strip = galleryOverlay.find('.ug-thumbnail-strip');
        $strip.on('contextmenu', '.ug-thumbnail', function(e) {
            e.preventDefault();
            const $thumb = $(this);
            const index = parseInt($thumb.data('index'));
            ThumbnailStrip.showContextMenu($thumb, index, e.pageX, e.pageY);
        });
        $(document).on('click.thumbnailstrip', () => {
            ThumbnailStrip.hideContextMenu();
        });
    },
    showContextMenu: ($thumb, index, x, y) => {
        ThumbnailStrip.hideContextMenu();
        const $menu = $('<div>').addClass('ug-thumbnail-context-menu');
        const menuItems = [
            { text: 'Open Image', action: () => Gallery.showExpandedView(index) },
            { text: 'Download Image', action: () => DownloadManager.downloadImageByIndex(index) },
            { text: 'Copy URL', action: () => ThumbnailStrip.copyImageUrl(index) },
            { text: 'Remove from Gallery', action: () => ThumbnailStrip.removeFromGallery(index), danger: true }
        ];
        menuItems.forEach(item => {
            const $item = $('<button>')
                .addClass('ug-thumbnail-context-menu-item')
                .text(item.text)
                .toggleClass('danger', item.danger)
                .on('click', (e) => {
                    e.stopPropagation();
                    item.action();
                    ThumbnailStrip.hideContextMenu();
                });
            $menu.append($item);
        });
        $menu.css({
            left: Math.min(x, window.innerWidth - 170) + 'px',
            top: Math.min(y - 10, window.innerHeight - 200) + 'px'
        });
        $('body').append($menu);
        setTimeout(() => $menu.addClass('show'), 10);
    },
    hideContextMenu: () => {
        $('.ug-thumbnail-context-menu').removeClass('show');
        setTimeout(() => {
            $('.ug-thumbnail-context-menu').remove();
        }, 200);
    },
    copyImageUrl: (index) => {
        const mediaItem = state.fullSizeImageSrcs[index];
        if (!mediaItem) return;
        navigator.clipboard.writeText(mediaItem.src).then(() => {
            state.notification = 'Image URL copied to clipboard';
            state.notificationType = 'success';
        }).catch(err => {
            console.error('Failed to copy URL:', err);
            state.notification = 'Failed to copy URL';
            state.notificationType = 'error';
        });
    },
    removeFromGallery: (index) => {
        if (confirm('Are you sure you want to remove this image from the gallery?')) {
            state.fullSizeImageSrcs.splice(index, 1);
            state.originalImageSrcs.splice(index, 1);
            Gallery._populateAllThumbnails(
                galleryOverlay.find('.ug-gallery-thumbnail-grid'),
                galleryOverlay.find('.ug-thumbnail-strip')
            );
            const $counter = galleryOverlay.find('.ug-gallery-counter');
            $counter.text(`${state.currentGalleryIndex + 1} / ${state.fullSizeImageSrcs.length}`);
            state.notification = 'Image removed from gallery';
            state.notificationType = 'info';
        }
    },
    updateThumbnailNumbers: () => {
        galleryOverlay.find('.ug-thumbnail').each(function(index) {
            const $number = $(this).find('.ug-thumbnail-number');
            if ($number.length === 0) {
                $(this).append(`<span class="ug-thumbnail-number">${index + 1}</span>`);
            } else {
                $number.text(index + 1);
            }
        });
    }
};

let lastFocusedElement;
let focusTrapListener;
const UI = {
    createToggleButton: (name, action, disabled = false) => {
        const btn = document.createElement('a');
        btn.textContent = name;
        btn.addEventListener('click', action);
        btn.style.cursor = 'pointer';
        btn.classList.add(CSS.BTN);
        if (disabled) {
            btn.disabled = true;
            btn.classList.add('disabled');
        }
        return btn;
    },
    createLoadingOverlay: (text = 'Loading...') => {
        const overlay = document.createElement('div');
        overlay.className = CSS.LOADING;
        const loadingText = document.createElement('div');
        loadingText.textContent = text;
        overlay.appendChild(loadingText);
        return overlay;
    },
    createButtonGroup: (buttonsConfig) => {
        const div = document.createElement('div');
        div.classList.add(CSS.BTN_CONTAINER);
        buttonsConfig.forEach(config => {
            let createThisButton = true;
            switch (config.name) {
                case 'REMOVE': if (state.hideRemoveButton) createThisButton = false; break;
                case 'FULL': if (state.hideFullButton) createThisButton = false; break;
                case 'DOWNLOAD': if (state.hideDownloadButton) createThisButton = false; break;
                case 'HEIGHT': if (state.hideHeightButton) createThisButton = false; break;
                case 'WIDTH': if (state.hideWidthButton) createThisButton = false; break;
            }
            if (!createThisButton) return;
            const button = UI.createToggleButton(config.text, config.action);
            div.append(button);
            button.classList.add(CSS.BTN);
        });
        return div;
    },
    createNavigationButton: (direction) => {
        const btn = document.createElement('button');
        btn.textContent = direction === 'prev' ? '←' : '→';
        btn.className = `${CSS.GALLERY.NAV} ${direction === 'prev' ? CSS.GALLERY.PREV : CSS.GALLERY.NEXT}`;
        btn.addEventListener('click', direction === 'prev' ? Gallery.prevImage : Gallery.nextImage);
        btn.setAttribute('aria-label', direction === 'prev' ? 'Previous Image' : 'Next Image');
        return btn;
    },
    showLoadingOverlay: (text) => {
        if (!elements.loadingOverlay) {
            elements.loadingOverlay = UI.createLoadingOverlay(text);
            document.body.appendChild(elements.loadingOverlay);
        } else {
            UI.updateLoadingOverlayText(text);
        }
    },
    updateLoadingOverlayText: (text) => {
        if (elements.loadingOverlay) {
            const loadingText = elements.loadingOverlay.querySelector('div');
            if (loadingText) loadingText.textContent = text;
        }
    },
    hideLoadingOverlay: () => {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.remove();
            elements.loadingOverlay = null;
        }
    },
    createNotificationArea: () => {
        const area = document.createElement('div');
        area.id = CSS.NOTIF_AREA;
        area.classList.add(CSS.NOTIF_AREA);
        area.style.top = state.notificationPosition === 'top' ? '10px' : 'auto';
        area.style.bottom = state.notificationPosition === 'bottom' ? '10px' : 'auto';
        document.body.appendChild(area);
        return area;
    },
    createNotification: () => {
        let area = document.getElementById(CSS.NOTIF_AREA);
        if (!area) area = UI.createNotificationArea();
        const container = document.createElement('div');
        container.id = CSS.NOTIF_CONTAINER;
        container.classList.add(CSS.NOTIF_CONTAINER);
        const text = document.createElement('div');
        text.id = CSS.NOTIF_TEXT;
        container.appendChild(text);
        const closeBtn = document.createElement('button');
        closeBtn.id = CSS.NOTIF_CLOSE;
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            state.notification = null;
        });
        container.appendChild(closeBtn);
        const reportBtn = document.createElement('a');
        reportBtn.id = CSS.NOTIF_REPORT;
        reportBtn.textContent = 'Report Issue';
        reportBtn.href = 'https://github.com/TearTyr/Ultra-Galleries/issues';
        reportBtn.target = '_blank';
        container.appendChild(reportBtn);
        area.appendChild(container);
        return container;
    },
    _notificationTimeoutId: null,
    showNotification: (message, type = 'info') => {
        if (!state.notificationsEnabled && !['error', 'warning'].includes(type)) return;
        let area = document.getElementById(CSS.NOTIF_AREA);
        if (!area) area = UI.createNotificationArea();
        let container = area.querySelector(`.${CSS.NOTIF_CONTAINER}`);
        if (!container) container = UI.createNotification();
        const isAlreadyVisible = container.style.display === 'flex' && !container.classList.contains('ug-slide-out');
        if (UI._notificationTimeoutId) {
            clearTimeout(UI._notificationTimeoutId);
            UI._notificationTimeoutId = null;
        }
        container.classList.remove('ug-update', 'ug-slide-in', 'ug-slide-out');
        const text = container.querySelector(`#${CSS.NOTIF_TEXT}`);
        text.textContent = message;
        container.className = `${CSS.NOTIF_CONTAINER} ${type}`;
        if (state.animationsEnabled) {
            if (isAlreadyVisible) {
                container.classList.add('ug-update');
                container.addEventListener('animationend', () => {
                    container.classList.remove('ug-update');
                }, { once: true });
            } else {
                container.classList.add('ug-slide-in');
            }
        }
        container.style.display = 'flex';
        if (['info', 'success'].includes(type)) {
            UI._notificationTimeoutId = setTimeout(() => {
                state.notification = null;
            }, 5000);
        }
    },
    hideNotification: () => {
        const container = document.getElementById(CSS.NOTIF_CONTAINER);
        if (!container) return;
        if (UI._notificationTimeoutId) {
            clearTimeout(UI._notificationTimeoutId);
            UI._notificationTimeoutId = null;
        }
        if (state.animationsEnabled) {
            container.classList.add('ug-slide-out');
            container.classList.remove('ug-slide-in');
            setTimeout(() => container.style.display = 'none', 500);
        } else {
            container.classList.remove('ug-slide-in', 'ug-slide-out');
            container.style.display = 'none';
        }
    },
    forceHideNotification: () => {
        if (UI._notificationTimeoutId) {
            clearTimeout(UI._notificationTimeoutId);
            UI._notificationTimeoutId = null;
        }
        const container = document.getElementById(CSS.NOTIF_CONTAINER);
        if (container) {
            container.remove();
        }
    },
    _createSettingElement: (setting) => {
        const $div = $('<div>').addClass('ug-setting-item');
        const $label = $('<label>').attr('for', setting.id).text(setting.label);
        const handleChange = (value) => {
            if (setting.stateKey) state[setting.stateKey] = value;
            if (setting.gmKey) StateManager.setStoredValue(setting.gmKey, value);
            if (setting.onChange) setting.onChange(value);
        };
        switch (setting.type) {
            case 'checkbox':
                $div.addClass('ug-settings-checkbox-label');
                const $input = $('<input type="checkbox">').attr('id', setting.id).prop('checked', state[setting.stateKey])
                    .on('change', e => handleChange($(e.target).prop('checked')));
                $div.append($input, $label);
                break;
            case 'text':
                $div.append($label);
                const $textInput = $(`<input type="text">`).attr({ id: setting.id, value: state[setting.stateKey], maxlength: setting.maxLength || 50 })
                    .addClass('ug-settings-input').on('change', e => handleChange($(e.target).val()));
                $div.append($textInput);
                break;
            case 'select':
                $div.append($label);
                const $select = $(`<select>`).attr('id', setting.id).addClass('ug-settings-input').on('change', e => handleChange(e.target.value));
                setting.options.forEach(opt => $select.append($(`<option>`).val(opt.value).text(opt.text)));
                $select.val(state[setting.stateKey]);
                $div.append($select);
                break;
            case 'button':
                return $('<button>').addClass('ug-button ug-settings-input').text(setting.label).on('click', setting.action);
        }
        return $div;
    },
    createSettingsUI: () => {
        const settingsConfig = [
            {
                title: 'General', key: 'general', settings: [
                    { id: 'animationsToggle', label: 'Enable Animations', type: 'checkbox', stateKey: 'animationsEnabled', gmKey: 'animationsEnabled' },
                    { id: 'bottomStripeToggle', label: 'Show Thumbnail Strip', type: 'checkbox', stateKey: 'bottomStripeVisible', gmKey: 'bottomStripeVisible' }
                ]
            },
            {
                title: 'Pan & Zoom', key: 'panZoom', settings: [
                    { id: 'zoomEnabledToggle', label: 'Enable Zoom & Pan', type: 'checkbox', stateKey: 'zoomEnabled', gmKey: 'zoomEnabled' },
                    { id: 'inertiaEnabledToggle', label: 'Enable Smooth Pan Inertia', type: 'checkbox', stateKey: 'inertiaEnabled', gmKey: 'inertiaEnabled' }
                ]
            },
            {
                title: 'Slideshow', key: 'slideshow', settings: [
                    {
                        id: 'slideshowDelay',
                        label: 'Slideshow Delay (ms):',
                        type: 'text',
                        stateKey: 'slideshowDelay',
                        gmKey: 'slideshowDelay',
                        maxLength: 5,
                        onChange: (value) => {
                            const delay = parseInt(value) || 3000;
                            Slideshow.setDelay(delay);
                        }
                    },
                    { id: 'slideshowPauseOnHover', label: 'Pause on Hover', type: 'checkbox', stateKey: 'slideshowPauseOnHover', gmKey: 'slideshowPauseOnHover' }
                ]
            },
            {
                title: 'Buttons', key: 'buttonVisibility', settings: [
                    { id: 'hideNavArrows', label: 'Hide Navigation Arrows', type: 'checkbox', stateKey: 'hideNavArrows', gmKey: 'hideNavArrows' },
                    { id: 'hideRemoveBtn', label: 'Hide Remove Button', type: 'checkbox', stateKey: 'hideRemoveButton', gmKey: 'hideRemoveButton' },
                    { id: 'hideFullBtn', label: 'Hide Full Size Button', type: 'checkbox', stateKey: 'hideFullButton', gmKey: 'hideFullButton' },
                    { id: 'hideDownloadBtn', label: 'Hide Download Button', type: 'checkbox', stateKey: 'hideDownloadButton', gmKey: 'hideDownloadButton' },
                    { id: 'hideHeightBtn', label: 'Hide Fill Height Button', type: 'checkbox', stateKey: 'hideHeightButton', gmKey: 'hideHeightButton' },
                    { id: 'hideWidthBtn', label: 'Hide Fill Width Button', type: 'checkbox', stateKey: 'hideWidthButton', gmKey: 'hideWidthButton' }
                ]
            },
            {
                title: 'Keyboard', key: 'keys', settings: [
                    { id: 'galleryKeyInput', label: 'Gallery Key:', type: 'text', stateKey: 'galleryKey', gmKey: 'galleryKey', maxLength: 1 },
                    { id: 'prevImageKeyInput', label: 'Previous Image Key:', type: 'text', stateKey: 'prevImageKey', gmKey: 'prevImageKey', maxLength: 1 },
                    { id: 'nextImageKeyInput', label: 'Next Image Key:', type: 'text', stateKey: 'nextImageKey', gmKey: 'nextImageKey', maxLength: 1 }
                ]
            },
            {
                title: 'Notifications', key: 'notifications', settings: [
                    { id: 'notificationsEnabledToggle', label: 'Enable Notifications', type: 'checkbox', stateKey: 'notificationsEnabled', gmKey: 'notificationsEnabled' },
                    { id: 'notificationPosition', label: 'Notification Position:', type: 'select', stateKey: 'notificationPosition', gmKey: 'notificationPosition', options: [{ value: 'top', text: 'Top' }, { value: 'bottom', text: 'Bottom' }] }
                ]
            },
            {
                title: 'Downloads', key: 'optimizations', settings: [
                    { id: 'optimizePngToggle', label: 'Optimize PNGs in ZIP (Slower)', type: 'checkbox', stateKey: 'optimizePngInZip', gmKey: 'optimizePngInZip' },
                    { id: 'persistentCachingToggle', label: 'Enable Persistent Image Caching', type: 'checkbox', stateKey: 'enablePersistentCaching', gmKey: 'enablePersistentCaching' },
                    { id: 'clearCacheButton', label: 'Clear Persistent Cache', type: 'button', action: clearDexieCache },
                    { id: 'exportSettingsButton', label: 'Export Settings', type: 'button', action: () => {
                        const settings = SettingsManager.exportSettings();
                        const blob = new Blob([settings], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'ultra-galleries-settings.json';
                        a.click();
                        URL.revokeObjectURL(url);
                        state.notification = 'Settings exported';
                        state.notificationType = 'success';
                    }},
                    { id: 'importSettingsButton', label: 'Import Settings', type: 'button', action: () => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.json';
                        input.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    SettingsManager.importSettings(e.target.result);
                                };
                                reader.readAsText(file);
                            }
                        };
                        input.click();
                    }},
                    { id: 'resetSettingsButton', label: 'Reset to Defaults', type: 'button', action: () => {
                        if (confirm('Are you sure you want to reset all settings to defaults?')) {
                            SettingsManager.resetToDefaults();
                            location.reload();
                        }
                    }}
                ]
            },
            {
                title: 'File Formatting', key: 'formatting', settings: [
                    { id: 'zipFileNameFormatInput', label: 'Zip File Name Format:', type: 'text', stateKey: 'zipFileNameFormat', gmKey: 'zipFileNameFormat' },
                    { id: 'imageFileNameFormatInput', label: 'Image File Name Format:', type: 'text', stateKey: 'imageFileNameFormat', gmKey: 'imageFileNameFormat' }
                ]
            }
        ];
        const $overlay = $('<div>').attr({ id: 'ug-settings-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'ug-settings-main-header' }).addClass('ug-settings-overlay');
        const $container = $('<div>').addClass('ug-settings-container').appendTo($overlay);
        const $sidebar = $('<div>').addClass('ug-settings-sidebar').appendTo($container);
        const $content = $('<div>').addClass('ug-settings-content').appendTo($container);
        const $header = $('<div>').addClass('ug-settings-header').appendTo($content);
        const $headerText = $('<h2>').attr('id', 'ug-settings-main-header').appendTo($header);
        $('<button>').addClass('ug-settings-close-btn').text(BUTTONS.CLOSE).on('click', () => state.settingsOpen = false).appendTo($header);
        const $body = $('<div>').addClass('ug-settings-body').appendTo($content);
        $('<div>').addClass('ug-sidebar-header').text('Settings').appendTo($sidebar);
        settingsConfig.forEach(section => {
            const $sectionEl = $('<div>').addClass('ug-settings-section').attr('data-section-key', section.key).hide().appendTo($body);
            section.settings.forEach(setting => $sectionEl.append(UI._createSettingElement(setting)));
            const $button = $('<button>').addClass('ug-sidebar-button').text(section.title).data('section-key', section.key)
                .on('click', function () {
                    const key = $(this).data('section-key');
                    $('.ug-sidebar-button').removeClass('active');
                    $(this).addClass('active');
                    $('.ug-settings-section').hide();
                    $(`.ug-settings-section[data-section-key="${key}"]`).show();
                    $headerText.text(section.title);
                });
            $sidebar.append($button);
        });
        $sidebar.find('.ug-sidebar-button').first().trigger('click');
        $('body').append($overlay);
    },
    showSettings: () => {
        lastFocusedElement = document.activeElement;
        UI.createSettingsUI();
        const overlay = document.getElementById('ug-settings-overlay');
        if (!overlay) return;
        overlay.classList.add('opening');
        const focusable = Array.from(overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];
        firstFocusable?.focus();
        focusTrapListener = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };
        document.addEventListener('keydown', focusTrapListener);
    },
    closeSettings: () => {
        if (focusTrapListener) {
            document.removeEventListener('keydown', focusTrapListener);
            focusTrapListener = null;
        }
        const overlay = document.getElementById('ug-settings-overlay');
        if (overlay) {
            overlay.classList.remove('opening');
            setTimeout(() => {
                overlay.remove();
                lastFocusedElement?.focus();
            }, 300);
        }
    }
};

let galleryOverlay = null;
const Gallery = {
    _preloadedImageCache: {},
    _preloadingInProgress: {},

    _clearPreloadCache: function () {
        for (const index in Gallery._preloadedImageCache) {
            const cachedItem = Gallery._preloadedImageCache[index];
            if (typeof cachedItem === 'string' && cachedItem.startsWith('blob:')) {
                BlobManager.revokeUrl(cachedItem);
            }
        }
        Gallery._preloadedImageCache = {};
        Gallery._preloadingInProgress = {};
        BlobManager.revokeAll();
    },

    _fetchAndCacheImage: async function (indexToPreload, sessionId = null) {
        if (indexToPreload < 0 || indexToPreload >= state.originalImageSrcs.length) return;
        if (Gallery._preloadedImageCache[indexToPreload] || Gallery._preloadingInProgress[indexToPreload]) return;

        const mediaItem = state.originalImageSrcs[indexToPreload];
        if (!mediaItem || mediaItem.type !== 'image') return;
        if (sessionId !== null && state.currentLoadSessionId !== sessionId) return;

        const originalImageUrl = mediaItem.src;
        if (!originalImageUrl) return;

        Gallery._preloadingInProgress[indexToPreload] = true;
        try {
            // fetchWithRetry automatically handles DB storage.
            const blob = await ImageLoader.fetchWithRetry(originalImageUrl, sessionId);
            if (blob) {
                Gallery._preloadedImageCache[indexToPreload] = BlobManager.createUrl(blob);
            }
        } catch (error) {
            console.error(`Preload failed for ${indexToPreload}`, error);
        } finally {
            delete Gallery._preloadingInProgress[indexToPreload];
        }
    },

    _preloadAdjacentImages: function (currentIndex) {
        const sessionId = state.currentLoadSessionId;
        for (let i = 1; i <= CONFIG.PRELOAD_COUNT; i++) {
            Gallery._fetchAndCacheImage(currentIndex + i, sessionId);
        }
        Gallery._fetchAndCacheImage(currentIndex - 1, sessionId);
    },

    _createGalleryOverlayAndContainer: function () {
        galleryOverlay = $('<div>').attr('id', 'gallery-overlay').addClass(CSS.GALLERY.OVERLAY);
        const $container = $('<div>').addClass(CSS.GALLERY.CONTAINER).appendTo(galleryOverlay);
        return $container;
    },

    _createBaseViews: function ($galleryContentContainer) {
        const $gridView = $('<div>').addClass(CSS.GALLERY.GRID_VIEW).appendTo($galleryContentContainer);
        const $expandedView = $('<div>').addClass(CSS.GALLERY.EXPANDED_VIEW).addClass(CSS.GALLERY.HIDE).appendTo($galleryContentContainer);
        return { $gridView, $expandedView };
    },

    _createGridViewContent: function ($gridViewElement) {
        const $thumbnailGrid = $('<div>').addClass(CSS.GALLERY.THUMBNAIL_GRID).appendTo($gridViewElement);
        $('<button>')
            .text(BUTTONS.CLOSE).addClass(CSS.GALLERY.GRID_CLOSE)
            .attr('aria-label', 'Close Gallery').on('click', Gallery.closeGallery)
            .appendTo($gridViewElement);
        return $thumbnailGrid;
    },

    _createExpandedViewToolbar: function ($expandedViewElement) {
        const $toolbar = $('<div>').addClass(CSS.GALLERY.TOOLBAR).on('mousedown', e => e.stopPropagation());
        $('<button>').attr({ id: 'reset-btn', title: 'Reset Zoom & Position' }).addClass(CSS.GALLERY.TOOLBAR_BTN)
            .text('Reset').on('click', Zoom.resetZoom).appendTo($toolbar);
        const $zoomControls = $('<div>').addClass('zoom-controls').appendTo($toolbar);
        const $zoomOutBtn = $('<button>').attr({ id: 'zoom-out-btn', title: 'Zoom Out' }).addClass(CSS.GALLERY.TOOLBAR_BTN)
            .on('click', () => Zoom.zoom(-CONFIG.ZOOM_STEP)).appendTo($zoomControls);
        $zoomOutBtn.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="8" y1="11" x2="14" y2="11"></line><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
        $('<span>').attr('id', 'zoom-level').addClass('zoom-level').text('100%').appendTo($zoomControls);
        const $zoomInBtn = $('<button>').attr({ id: 'zoom-in-btn', title: 'Zoom In' }).addClass(CSS.GALLERY.TOOLBAR_BTN)
            .on('click', () => Zoom.zoom(CONFIG.ZOOM_STEP)).appendTo($zoomControls);
        $zoomInBtn.html('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>');
        $('<button>').attr({
            id: 'slideshow-btn',
            title: 'Start Slideshow'
        }).addClass(CSS.GALLERY.TOOLBAR_BTN)
            .html('▶')
            .on('click', Slideshow.toggle)
            .appendTo($toolbar);
        $('<button>').text(BUTTONS.FULLSCREEN).addClass(CSS.GALLERY.FULLSCREEN).addClass(CSS.GALLERY.TOOLBAR_BTN)
            .attr('aria-label', 'Toggle Fullscreen').on('click', Gallery.toggleFullscreen)
            .appendTo($toolbar);
        $expandedViewElement.append($toolbar);
        const $closeButton = $('<button>')
            .addClass('ug-gallery-close-button')
            .attr('aria-label', 'Close Gallery')
            .html('✕')
            .on('click', Gallery.closeGallery);
        $expandedViewElement.append($closeButton);
    },

    _createExpandedViewMainImageArea: function ($expandedViewElement) {
        const $zoomContainer = $('<div>').addClass(CSS.GALLERY.ZOOM_CONTAINER).appendTo($expandedViewElement);
        const $mainImageContainer = $('<div>').addClass(CSS.GALLERY.MAIN_IMG_CONTAINER).addClass('image-container').appendTo($zoomContainer);
        $('<div>').addClass('pan-indicator')
            .css({ position: 'absolute', top: '15px', left: '15px', zIndex: '10', opacity: '0', transition: 'opacity 0.3s ease', pointerEvents: 'none' })
            .html(`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="white" opacity="0.7"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"/></svg>`)
            .appendTo($mainImageContainer);
        return { $mainImageContainer };
    },

    _createExpandedViewNavigationAndCounter: function ($expandedViewElement) {
        const $navContainer = $('<div>').addClass(CSS.GALLERY.NAV_CONTAINER).on('mousedown', e => e.stopPropagation());
        if (!state.hideNavArrows) {
            $navContainer.append(UI.createNavigationButton('prev'), UI.createNavigationButton('next'));
        }
        $expandedViewElement.append($navContainer);
        $('<div>').addClass(CSS.GALLERY.COUNTER).addClass(CSS.GALLERY.HIDE).appendTo($expandedViewElement);
    },

    _createExpandedViewThumbnailStrip: function ($expandedViewElement) {
        const $thumbnailStripContainer = $('<div>').addClass(CSS.GALLERY.STRIP_CONTAINER)
            .css('display', state.bottomStripeVisible ? 'flex' : 'none')
            .on('mousedown', e => e.stopPropagation()).appendTo($expandedViewElement);
        const $thumbnailStrip = $('<div>').addClass(CSS.GALLERY.THUMBNAIL_STRIP).appendTo($thumbnailStripContainer);
        return $thumbnailStrip;
    },

    _populateAllThumbnails: function ($gridThumbnailsContainer, $stripThumbnailsContainer) {
        const gridFragment = document.createDocumentFragment();
        const stripFragment = document.createDocumentFragment();
        state.fullSizeImageSrcs.forEach((mediaItem, index) => {
            if (mediaItem) {
                const thumbSrc = mediaItem.type === 'video' ? mediaItem.poster : mediaItem.src;
                const $gridThumbImg = $('<img>').attr('src', thumbSrc).addClass(CSS.GALLERY.THUMBNAIL)
                    .data('index', index).on('click', () => Gallery.showExpandedView(index))
                    .attr('aria-label', `Open media ${index + 1}`);
                const $gridContainer = $('<div>').addClass(CSS.GALLERY.THUMBNAIL_CONTAINER).append($gridThumbImg);
                gridFragment.appendChild($gridContainer[0]);
                const $stripThumbImg = $('<img>').attr('src', thumbSrc).addClass(CSS.GALLERY.THUMBNAIL_ITEM)
                    .data('index', index).on('click', () => Gallery.showExpandedView(index))
                    .attr('aria-label', `Thumbnail ${index + 1}`);
                stripFragment.appendChild($stripThumbImg[0]);
            }
        });
        $gridThumbnailsContainer[0].appendChild(gridFragment);
        $stripThumbnailsContainer[0].appendChild(stripFragment);
    },

    _setupGalleryInteractions: function ($expandedViewElement, $mainImageContainerElement) {
        $mainImageContainerElement.on('wheel', e => {
            const currentItem = state.fullSizeImageSrcs[state.currentGalleryIndex];
            if (currentItem && currentItem.type === 'image') {
                Zoom.handleWheelZoom(e);
            }
        });
        $expandedViewElement.on('mousedown', e => {
            const currentItem = state.fullSizeImageSrcs[state.currentGalleryIndex];
            if (currentItem && currentItem.type === 'image') {
                if ($(e.target).closest(`.${CSS.GALLERY.TOOLBAR}, .${CSS.GALLERY.NAV_CONTAINER}, .${CSS.GALLERY.STRIP_CONTAINER}`).length || e.button === 2) {
                    return;
                }
                Zoom.startDrag(e);
            }
        });
        $mainImageContainerElement.on('dblclick', e => {
            const currentItem = state.fullSizeImageSrcs[state.currentGalleryIndex];
            if (currentItem && currentItem.type === 'image' && e.button === 0) {
                if (state.zoomScale > 1) {
                    Zoom.resetZoom();
                } else {
                    const rect = $mainImageContainerElement[0].getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const clickY = e.clientY - rect.top;
                    state.zoomOrigin = { x: clickX, y: clickY };
                    const newScale = 2.5;
                    const imageX = (clickX - state.imageOffset.x) / state.zoomScale;
                    const imageY = (clickY - state.imageOffset.y) / state.zoomScale;
                    const newOffsetX = clickX - (imageX * newScale);
                    const newOffsetY = clickY - (imageY * newScale);
                    const mainImageDOM = $mainImageContainerElement.find(`.${CSS.GALLERY.MAIN_IMG}`)[0];
                    if (!mainImageDOM) return;
                    const boundedOffset = Zoom.enforceBoundaries(newOffsetX, newOffsetY, newScale, rect, mainImageDOM);
                    Zoom._applyTransition($mainImageContainerElement, () => {
                        state.imageOffset.x = boundedOffset.x;
                        state.imageOffset.y = boundedOffset.y;
                        state.zoomScale = newScale;
                        Zoom.applyZoom();
                    });
                }
            }
        });
        let controlsTimeout;
        $expandedViewElement.on('mousemove', () => {
            state.controlsVisible = true;
            clearTimeout(controlsTimeout);
            controlsTimeout = setTimeout(() => {
                if (!state.isDragging && !state.pinchZoomActive) state.controlsVisible = false;
            }, 3000);
        });
        state.controlsVisible = true;
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (!state.isDragging && !state.pinchZoomActive) state.controlsVisible = false;
        }, 3000);
        Zoom.setupTouchEvents();
        $(document).on('mousemove.galleryDrag', Zoom.dragImage);
        $(document).on('mouseup.galleryDrag', Zoom.endDrag);
    },

    createGallery: function () {
        if (galleryOverlay && galleryOverlay.length) {
            Gallery.showExpandedView(0);
            state.isGalleryMode = true;
            return;
        }
        const fragment = document.createDocumentFragment();
        galleryOverlay = $('<div>').attr('id', 'gallery-overlay').addClass(CSS.GALLERY.OVERLAY);
        const $galleryContentContainer = Gallery._createGalleryOverlayAndContainer();
        const { $gridView, $expandedView } = Gallery._createBaseViews($galleryContentContainer);
        const $gridThumbnailsContainer = Gallery._createGridViewContent($gridView);
        Gallery._createExpandedViewToolbar($expandedView);
        const { $mainImageContainer } = Gallery._createExpandedViewMainImageArea($expandedView);
        Gallery._createExpandedViewNavigationAndCounter($expandedView);
        const $stripThumbnailsContainer = Gallery._createExpandedViewThumbnailStrip($expandedView);
        fragment.appendChild(galleryOverlay[0]);
        document.body.appendChild(fragment);
        Gallery._populateAllThumbnails($gridThumbnailsContainer, $stripThumbnailsContainer);
        Gallery._setupGalleryInteractions($expandedView, $mainImageContainer);
        Gallery.showExpandedView(0);

        state.isGalleryMode = true;
        Accessibility.init();
    },

    showGridView: function () {
        Gallery.closeGallery();
    },

    showExpandedView: function (index) {
        return EnhancedGallery.showExpandedViewEnhanced(index);
    },

    closeGallery: function () {
        if (!galleryOverlay || !galleryOverlay.length) return;
        state.isGalleryMode = false;
        state.isFullscreen = false;
        Slideshow.stop();
        PreloadManager.clearQueue();
        Gallery._clearPreloadCache();
        galleryOverlay.remove();
        galleryOverlay = null;
        $(document).off('.galleryDrag');
    },

    toggleGallery: function () {
        if (state.isGalleryMode) {
            Gallery.closeGallery();
        } else {
            if (state.galleryReady && state.fullSizeImageSrcs.length > 0) {
                Gallery.createGallery();
            } else if (!state.galleryReady) {
                state.notification = "Gallery is still loading media."; state.notificationType = "info";
            } else {
                state.notification = "No media to display in gallery."; state.notificationType = "info";
            }
        }
    },

    toggleFullscreen: function () {
        state.isFullscreen = !state.isFullscreen;
    },

    nextImage: function () {
        if (state.fullSizeImageSrcs.length === 0) return;
        let newIndex = (state.currentGalleryIndex + 1) % state.fullSizeImageSrcs.length;
        Gallery.showExpandedView(newIndex);
    },

    prevImage: function () {
        if (state.fullSizeImageSrcs.length === 0) return;
        let newIndex = (state.currentGalleryIndex - 1 + state.fullSizeImageSrcs.length) % state.fullSizeImageSrcs.length;
        Gallery.showExpandedView(newIndex);
    }
};

let loadedBlobUrls = new Map();

const ImageLoader = {
    imageActions: EnhancedImageLoader.imageActionsEnhanced,

    simulateScrollDown: async () => {
        return new Promise(resolve => {
            const images = document.querySelectorAll(`${SELECTORS.IMAGE_LINK} img, ${SELECTORS.MAIN_THUMBNAIL} img`);
            if (images.length === 0) {
                resolve();
                return;
            }
            let loadedCount = 0;
            const checkAllLoaded = () => {
                loadedCount++;
                if (loadedCount >= images.length) resolve();
            };
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        observer.unobserve(entry.target);
                        checkAllLoaded();
                    }
                });
            });
            images.forEach(img => observer.observe(img));
            setTimeout(resolve, 1000);
        });
    },

    fetchWithRetry: async (url, sessionId, retries = CONFIG.MAX_RETRIES, delay = CONFIG.RETRY_DELAY) => {
        if (state.currentLoadSessionId !== sessionId) return null;
        try {
            // Check cache first
            if (state.enablePersistentCaching && db) {
                const cachedBlob = await getImageFromDexie(url);
                if (cachedBlob) return cachedBlob;
            }

            return await new Promise((resolve, reject) => {
                if (state.currentLoadSessionId !== sessionId) reject(new Error('Stale session'));
                GM.xmlHttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: 'blob',
                    timeout: 15000, // Increased timeout
                    onload: async (response) => {
                        if (response.status === 200 || response.status === 206) {
                            const blob = response.response;
                            if (state.enablePersistentCaching && db) {
                                await storeImageInDexie(url, blob);
                            }
                            resolve(blob);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: (error) => reject(error),
                    ontimeout: () => reject(new Error('Request timeout'))
                });
            });
        } catch (err) {
            if (err.message === 'Stale session') throw err;
            if (retries <= 0) throw err;
            await Utils.delay(delay);
            return ImageLoader.fetchWithRetry(url, sessionId, retries - 1, delay * 1.5);
        }
    },

    loadImageAndApplyToPage: async (linkElement, galleryIndex, posterHref, isUniqueForGallery, sessionId, itemData) => {
        const imgElement = linkElement.querySelector('img');
        if (!imgElement) {
            if (state.currentLoadSessionId === sessionId) state.loadedImages++;
            return;
        }
        if (!imgElement.classList.contains('post__image')) imgElement.classList.add('post__image');

        const cacheKey = itemData.originalUrl;
        let blobUrlToUse = loadedBlobUrls.get(posterHref);

        try {
            if (!blobUrlToUse) {
                // Ensure blob is in Dexie, then convert to ObjectURL
                let blob = await ImageLoader.fetchWithRetry(cacheKey, sessionId);
                if (state.currentLoadSessionId !== sessionId) return;
                if (!blob) throw new Error("Failed to fetch blob");

                if (posterHref === cacheKey) {
                    blobUrlToUse = BlobManager.createUrl(blob);
                } else {
                    // Handle separate poster case (video)
                    const posterBlob = await ImageLoader.fetchWithRetry(posterHref, sessionId);
                    blobUrlToUse = BlobManager.createUrl(posterBlob);
                }
                loadedBlobUrls.set(posterHref, blobUrlToUse);
            }

            if (state.currentLoadSessionId !== sessionId) return;
            imgElement.src = blobUrlToUse;
            imgElement.dataset.originalSrc = cacheKey;
            imgElement.classList.add('ug-image-loaded');
            ImageSizing.applyFillHeight(imgElement);

            if (isUniqueForGallery) {
                state.fullSizeImageSrcs[galleryIndex] = itemData.type === 'video' ?
                    { type: 'video', src: cacheKey, poster: blobUrlToUse } :
                    { type: 'image', src: cacheKey, originalSrc: cacheKey };

                state.originalImageSrcs[galleryIndex] = {
                    src: cacheKey,
                    type: itemData.type,
                    fileName: linkElement.getAttribute('download') || cacheKey.split('/').pop()
                };
                state.mediaLoaded[galleryIndex] = true;
            }
            state.loadedImages++;

        } catch (error) {
            ErrorHandler.handleImageError(error, cacheKey, imgElement, {
                linkElement, galleryIndex, posterHref, isUniqueForGallery, itemData
            });
            if (state.currentLoadSessionId === sessionId) {
                state.loadedImages++;
                state.errorCount++;
            }
        }
    },

    collectUniqueMediaItems: (postContainer) => {
        const uniqueGalleryItems = new Map();
        const mediaSelectors = [SELECTORS.IMAGE_LINK, SELECTORS.ATTACHMENT_LINK, SELECTORS.VIDEO_LINK];

        postContainer.querySelectorAll(mediaSelectors.join(', ')).forEach(linkElement => {
            const isVideo = linkElement.matches(SELECTORS.VIDEO_LINK);
            const isAttachment = linkElement.matches(SELECTORS.ATTACHMENT_LINK);
            let url, poster, type = 'image';

            if (isVideo) {
                type = 'video';
                url = linkElement.getAttribute('href')?.split('?')[0];
                poster = linkElement.querySelector('img, video')?.getAttribute('poster') || linkElement.querySelector('img')?.src;

                if (!url) return;

                if (!uniqueGalleryItems.has(url)) {
                    uniqueGalleryItems.set(url, {
                        linkElement,
                        originalUrl: url,
                        posterUrl: poster || "https://kemono.party/static/menu/recent.svg",
                        type: 'video',
                        fileName: linkElement.getAttribute('download') || url.split('/').pop()
                    });
                }
            } else {
                url = Utils.handleMediaSrc(linkElement);
                if (!url) return;
                if (isAttachment && !/\.(jpe?g|png|gif|webp)$/i.test(linkElement.getAttribute('download') || url)) return;

                if (!uniqueGalleryItems.has(url)) {
                    uniqueGalleryItems.set(url, {
                        linkElement,
                        originalUrl: url,
                        posterUrl: url,
                        type: 'image',
                        fileName: linkElement.getAttribute('download') || url.split('/').pop()
                    });
                }
            }
        });

        postContainer.querySelectorAll('video').forEach(videoEl => {
            let url = videoEl.getAttribute('src') || videoEl.querySelector('source')?.getAttribute('src');

            if (url) {
                url = url.split('?')[0];
                if (!uniqueGalleryItems.has(url)) {
                    let poster = videoEl.getAttribute('poster');
                    if (!poster || poster === "") {
                        poster = "https://kemono.party/static/menu/recent.svg";
                    }

                    uniqueGalleryItems.set(url, {
                        linkElement: videoEl,
                        originalUrl: url,
                        posterUrl: poster,
                        type: 'video',
                        fileName: url.split('/').pop()
                    });
                }
            }
        });

        return uniqueGalleryItems;
    },

    _concurrentRunner: (items, sessionId) => {
        const concurrencyLimit = CONFIG.MAX_CONCURRENT_FETCHES;
        const tasks = items.map((item, index) => () => ImageLoader.loadImageAndApplyToPage(
            item.linkElement, index, item.posterUrl, true, sessionId, item
        ));
        return new Promise((resolve) => {
            let running = 0;
            let index = 0;
            const total = tasks.length;
            const next = () => {
                if (state.currentLoadSessionId !== sessionId) return;
                if (index >= total) {
                    if (running === 0) resolve();
                    return;
                }
                const task = tasks[index++];
                running++;
                task().then(() => { running--; next(); }).catch(() => { running--; next(); });
            };
            for (let i = 0; i < concurrencyLimit && i < total; i++) next();
        });
    },

    loadImages: async () => {
        const postContainer = document.querySelector('section.site-section--post');
        if (!postContainer || !Utils.isPostPage() || state.isLoading) return;
        const sessionId = StateManager.generateSessionId();
        state.currentLoadSessionId = sessionId;
        try {
            state.isLoading = true;
            await Utils.delay(16);
            if (state.currentLoadSessionId !== sessionId) return;
            state.loadingMessage = 'Loading Media...';
            loadedBlobUrls.clear();
            Object.assign(state, {
                fullSizeImageSrcs: [], originalImageSrcs: [], virtualGallery: [],
                loadedImages: 0, mediaLoaded: {}, errorCount: 0
            });
            const uniqueGalleryItems = ImageLoader.collectUniqueMediaItems(postContainer);
            if (state.currentLoadSessionId !== sessionId) return;
            const uniqueItems = Array.from(uniqueGalleryItems.values());
            state.totalImages = uniqueItems.length;
            state.hasImages = state.totalImages > 0;
            state.fullSizeImageSrcs = Array(uniqueItems.length).fill(null);
            state.originalImageSrcs = Array(uniqueItems.length).fill(null);
            await ImageLoader.simulateScrollDown();
            Utils.ensureThumbnailsExist();
            await ImageLoader._concurrentRunner(uniqueItems, sessionId);
            if (state.currentLoadSessionId !== sessionId) return;
            ImageLoader.updateFinalStatus();
            state.galleryReady = true;
            state.isLoading = false;
            state.loadingMessage = null;
            EnhancedImageLoader.applyDefaultSizingToLoadedImages();
        } catch (error) {
            console.error('Critical Error in ImageLoader.loadImages:', error);
            state.isLoading = false;
        }
    },
    updateFinalStatus: () => {
        if (state.loadedImages === state.totalImages && state.totalImages > 0 && state.errorCount === 0) {
            state.notification = `Media Done Loading! Total: ${state.totalImages}`;
            state.notificationType = 'success';
        } else if (state.errorCount > 0) {
            state.notification = `Gallery: ${state.errorCount} error(s).`;
            state.notificationType = 'warning';
        }
    }
};

// ====================================================
//  Download Management
// ====================================================
const DownloadManager = {
    _worker: null,
    downloadAllImages: async () => {
        if (state.isDownloading) {
            Swal.fire('Download in Progress', 'A download is already running.', 'info');
            return;
        }
        const title = document.querySelector(SELECTORS.POST_TITLE)?.textContent?.trim() || 'Untitled';
        const artistName = document.querySelector(SELECTORS.POST_USER_NAME)?.textContent?.trim() || 'Unknown Artist';

        const itemsToDownload = state.originalImageSrcs.filter(item => item && item.src);
        if (itemsToDownload.length === 0) {
            state.notification = 'No media found to download.';
            state.notificationType = 'warning';
            return;
        }

        const result = await Swal.fire({
            title: 'Download All?',
            text: `Create ZIP from ${itemsToDownload.length} items?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Create ZIP',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;

        state.isDownloading = true;
        state.notification = 'Starting download...';

        // Optimized Worker: Accepts files one by one
        const workerCode = `
            self.onmessage = async (e) => {
                const { type, data } = e.data;
                if (type === 'init') {
                    importScripts(data.jszipUrl);
                    self.zip = new self.JSZip();
                    self.filesAdded = 0;
                    self.totalFiles = data.totalFiles;
                } else if (type === 'addFile') {
                    const { blob, name, folder } = data;
                    self.zip.file(name, blob);
                    self.filesAdded++;
                    self.postMessage({ type: 'progress', message: \`Added \${self.filesAdded}/\${self.totalFiles}\` });
                } else if (type === 'generate') {
                    self.postMessage({ type: 'progress', message: 'Bundling files... this may take a moment.' });
                    try {
                        const zipBlob = await self.zip.generateAsync({ type: 'blob', compression: "STORE" }, (meta) => {
                            self.postMessage({ type: 'progress', message: \`Bundling... \${Math.round(meta.percent)}%\` });
                        });
                        self.postMessage({ type: 'complete', zipBlob: zipBlob });
                    } catch(err) {
                        self.postMessage({ type: 'error', message: err.message });
                    }
                }
            };
        `;

        const blob = new Blob([workerCode], { type: 'application/javascript' });
        DownloadManager._worker = new Worker(URL.createObjectURL(blob));

        DownloadManager._worker.onmessage = (e) => {
            const { type, message, zipBlob } = e.data;
            if (type === 'progress') {
                state.notification = message;
                state.notificationType = 'info';
            } else if (type === 'complete') {
                const sanitizedTitle = Utils.sanitizeFileName(title);
                const sanitizedArtistName = Utils.sanitizeFileName(artistName);
                let zipFileName = state.zipFileNameFormat.replace('{artistName}', sanitizedArtistName).replace('{title}', sanitizedTitle);
                if (!zipFileName.toLowerCase().endsWith('.zip')) zipFileName += '.zip';
                saveAs(zipBlob, zipFileName);
                state.notification = 'Download complete!';
                state.notificationType = 'success';
                DownloadManager.cleanupWorker();
            } else if (type === 'error') {
                state.notification = `Download failed: ${message}`;
                state.notificationType = 'error';
                DownloadManager.cleanupWorker();
            }
        };

        DownloadManager._worker.postMessage({
            type: 'init',
            data: {
                jszipUrl: 'https://unpkg.com/jszip@3.9.1/dist/jszip.min.js',
                totalFiles: itemsToDownload.length
            }
        });

        // Stream files to worker
        const streamFiles = async () => {
            for (let i = 0; i < itemsToDownload.length; i++) {
                const item = itemsToDownload[i];
                if (!state.isDownloading) break;
                try {
                    // Fetch from Dexie to keep RAM low
                    let blob = await getImageFromDexie(item.src);
                    if (!blob) {
                        // Fallback fetch if cache evicted
                        blob = await ImageLoader.fetchWithRetry(item.src, state.currentLoadSessionId);
                    }

                    if (blob) {
                        let correctExt = item.fileName.split('.').pop().toLowerCase() || 'jpg';
                        const fileNameWithoutExt = item.fileName.replace(/\.[^/.]+$/, "");
                        let pathInZip = state.imageFileNameFormat
                            .replace('{title}', title.replace(/[/\\:*?"<>|]/g, '-'))
                            .replace('{artistName}', artistName.replace(/[/\\:*?"<>|]/g, '-'))
                            .replace('{fileName}', fileNameWithoutExt.replace(/[/\\:*?"<>|]/g, '-'))
                            .replace('{index}', i + 1);
                        if (!pathInZip.toLowerCase().endsWith(`.${correctExt}`)) pathInZip += `.${correctExt}`;

                        DownloadManager._worker.postMessage({
                            type: 'addFile',
                            data: { blob, name: pathInZip }
                        });
                    }
                } catch (e) {
                    console.warn(`Skipping ${item.src}`, e);
                }
            }
            if (state.isDownloading) {
                DownloadManager._worker.postMessage({ type: 'generate' });
            }
        };

        streamFiles();
    },

    cleanupWorker: () => {
        if (DownloadManager._worker) {
            DownloadManager._worker.terminate();
            DownloadManager._worker = null;
        }
        state.isDownloading = false;
    },

    downloadImageByIndex: async (index) => {
        const originalItem = state.originalImageSrcs[index];
        if (!originalItem || !originalItem.src) return;
        const fileName = Utils.sanitizeFileName(originalItem.fileName || `media_${index + 1}`);
        try {
            let blob = await getImageFromDexie(originalItem.src);
            if (!blob) blob = await ImageLoader.fetchWithRetry(originalItem.src, state.currentLoadSessionId);
            if (blob) saveAs(blob, fileName);
        } catch (error) {
            Swal.fire('Error!', `Failed to download media: ${error.message}`, 'error');
        }
    },
};

// ====================================================
// Post Actions Management
// ====================================================
let elements = {
    loadingOverlay: null,
    galleryButton: null,
    settingsButton: null,
};

const PostActions = {
    imageLinkClickHandler: event => {
        if (event.button !== 0) return;
        const clickedImageLink = event.target.closest(SELECTORS.IMAGE_LINK) || event.target.closest(SELECTORS.VIDEO_LINK);
        if (clickedImageLink) {
            event.preventDefault();
            event.stopPropagation();
        }
    },
    initPostActions: () => {
        try {
            const postActionsContainer = document.querySelector(SELECTORS.POST_ACTIONS);
            if (!postActionsContainer) return;
            const globalButtons = document.createElement('div');
            globalButtons.className = 'ug-injected-ui';
            elements.galleryButton = UI.createToggleButton('Loading Gallery...', Gallery.toggleGallery, true);
            elements.galleryButton.dataset.action = "gallery";
            globalButtons.append(
                UI.createToggleButton(BUTTONS.HEIGHT, () => PostActions.resizeAllImages('height')),
                UI.createToggleButton(BUTTONS.WIDTH, () => PostActions.resizeAllImages('width')),
                UI.createToggleButton(BUTTONS.FULL, () => PostActions.resizeAllImages('full')),
                UI.createToggleButton(BUTTONS.DOWNLOAD_ALL, DownloadManager.downloadAllImages),
                elements.galleryButton
            );
            postActionsContainer.append(globalButtons);
            if (!document.querySelector('.settings-button-wrapper')) {
                const settingsButton = document.createElement('button');
                settingsButton.textContent = BUTTONS.SETTINGS;
                settingsButton.className = 'settings-button';
                settingsButton.addEventListener('click', () => { state.settingsOpen = !state.settingsOpen; });
                const wrapper = document.createElement('div');
                wrapper.className = 'settings-button-wrapper ug-injected-ui';
                wrapper.appendChild(settingsButton);
                document.body.appendChild(wrapper);
                elements.settingsButton = wrapper;
            }
            const filesArea = document.querySelector('div.post__files');
            if (filesArea) {
                filesArea.querySelectorAll(SELECTORS.FILE_DIVS).forEach(thumbnailDiv => {
                    const imgElement = thumbnailDiv.querySelector('img');
                    if (!imgElement) return;
                    imgElement.classList.add('post__image');
                    const buttonGroupConfig = [
                        { text: BUTTONS.HEIGHT, action: PostActions.resizeImage, name: 'HEIGHT' },
                        { text: BUTTONS.WIDTH, action: PostActions.resizeImage, name: 'WIDTH' },
                        { text: BUTTONS.FULL, action: () => ImageLoader.imageActions.full(imgElement), name: 'FULL' },
                        {
                            text: BUTTONS.DOWNLOAD, action: () => {
                                const link = imgElement.closest('a');
                                const originalSrc = link ? (link.href.split('?')[0]) : imgElement.dataset.originalSrc;
                                const downloadIndex = state.originalImageSrcs.findIndex(item => item && item.src === originalSrc);
                                if (downloadIndex > -1) DownloadManager.downloadImageByIndex(downloadIndex);
                            }, name: 'DOWNLOAD'
                        },
                    ];
                    const buttonGroupElement = UI.createButtonGroup(buttonGroupConfig);
                    if (buttonGroupElement.childElementCount > 0) {
                        buttonGroupElement.classList.add('ug-injected-ui');
                        thumbnailDiv.parentNode.insertBefore(buttonGroupElement, thumbnailDiv);
                    }
                });
                if (!filesArea.dataset.ugLeftClickHandlerAttached) {
                    filesArea.addEventListener('click', PostActions.imageLinkClickHandler);
                    filesArea.dataset.ugLeftClickHandlerAttached = "true";
                }
            }
            ImageLoader.loadImages();
            state.postActionsInitialized = true;
            state.currentPostUrl = window.location.href;
        } catch (error) {
            console.error('Error initializing post actions:', error);
        }
    },
    cleanupPostActions: () => {
        UI.forceHideNotification();
        document.querySelectorAll('img.post__image.ug-image-loaded').forEach(img => {
            img.classList.remove('ug-image-loaded');
        });
        document.querySelectorAll('.ug-injected-ui').forEach(el => el.remove());
        const notifArea = document.getElementById(CSS.NOTIF_AREA);
        if (notifArea) notifArea.remove();
        UI.hideLoadingOverlay();
        const filesArea = document.querySelector('div.post__files');
        if (filesArea) {
            filesArea.removeEventListener('click', PostActions.imageLinkClickHandler);
            filesArea.removeAttribute('data-ug-leftClickHandler-attached');
        }
        BlobManager.revokeAll();
        loadedBlobUrls.clear();
        state.notification = null;
        Object.assign(state, {
            fullSizeImageSrcs: [], originalImageSrcs: [], virtualGallery: [],
            currentPostUrl: null, galleryReady: false, loadedImages: 0,
            totalImages: 0, mediaLoaded: {}, errorCount: 0,
            postActionsInitialized: false, currentLoadSessionId: null,
            isLoading: false, loadingMessage: null
        });
        elements = {};
    },
    resizeAllImages: action => {
        if (!ImageLoader.imageActions[action]) return;
        document.querySelectorAll('img.post__image').forEach(img => {
            ImageLoader.imageActions[action](img);
        });
    },
    resizeImage: evt => {
        const actionText = evt.currentTarget.textContent;
        const action = Object.keys(BUTTONS).find(key => BUTTONS[key] === actionText)?.toLowerCase();
        if (!action || !ImageLoader.imageActions[action]) return;
        const buttonContainer = evt.currentTarget.closest(`.${CSS.BTN_CONTAINER}`);
        const imageOwningThumbnailDiv = buttonContainer?.nextElementSibling;
        const displayedImage = imageOwningThumbnailDiv?.querySelector('img.post__image');
        if (displayedImage) ImageLoader.imageActions[action](displayedImage);
    },
};

const EventHandlers = {
    handleGlobalKeyDown: event => {
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeEl.tagName))) return;
        const keyLower = event.key.toLowerCase();
        if (Utils.isPostPage() && keyLower === state.galleryKey.toLowerCase()) {
            if (!event.altKey && !event.ctrlKey && !event.metaKey) {
                event.preventDefault();
                if (state.galleryReady) Gallery.toggleGallery();
                else { state.notification = "Gallery content is still loading."; state.notificationType = "info"; }
            }
            return;
        }
        if (state.settingsOpen && event.key === 'Escape') {
            event.preventDefault();
            state.settingsOpen = false;
            return;
        }
        if (state.isGalleryMode && galleryOverlay?.length) {
            const $expandedView = galleryOverlay.find(`.${CSS.GALLERY.EXPANDED_VIEW}`);
            if (event.key === 'Escape') {
                event.preventDefault();
                Gallery.closeGallery();
                return;
            }
            if (!$expandedView.hasClass(CSS.GALLERY.HIDE)) {
                if (keyLower === state.nextImageKey.toLowerCase() || keyLower === 'arrowright') {
                    event.preventDefault(); Gallery.nextImage();
                } else if (keyLower === state.prevImageKey.toLowerCase() || keyLower === 'arrowleft') {
                    event.preventDefault(); Gallery.prevImage();
                }
                if (keyLower === '+' || keyLower === '=') {
                    event.preventDefault(); Zoom.zoom(CONFIG.ZOOM_STEP);
                } else if (keyLower === '-') {
                    event.preventDefault(); Zoom.zoom(-CONFIG.ZOOM_STEP);
                } else if (keyLower === '0') {
                    event.preventDefault(); Zoom.resetZoom();
                } else if (keyLower === ' ') {
                    event.preventDefault(); Slideshow.toggle();
                }
            }
        }
    },
    handleGlobalError: event => {
        if (state.isGalleryMode || state.isLoading) {
            console.error('Script error:', event.error);
            state.notification = 'Encountered an error. Try refreshing the page.';
            state.notificationType = 'error';
            state.isLoading = false;
        }
    }
};

const updateGalleryButton = enabled => {
    if (elements.galleryButton) {
        elements.galleryButton.textContent = enabled ? BUTTONS.GALLERY : 'Loading Gallery...';
        elements.galleryButton.disabled = !enabled;
        elements.galleryButton.classList.toggle('disabled', !enabled);
    }
};

let lastProcessedUrl = null;
const injectUI = () => {
    try {
        const onPostPage = Utils.isPostPage();
        const postContainer = document.querySelector('section.site-section--post');
        const currentUrl = window.location.href;
        if (onPostPage && postContainer) {
            if (currentUrl !== lastProcessedUrl) {
                if (document.querySelector(SELECTORS.POST_ACTIONS)) {
                    PostActions.cleanupPostActions();
                    PostActions.initPostActions();
                    lastProcessedUrl = currentUrl;
                }
            }
        } else {
            if (lastProcessedUrl !== null) {
                PostActions.cleanupPostActions();
                lastProcessedUrl = null;
            }
        }
    } catch (error) {
        console.error('Error in injectUI:', error);
    }
};

const fullCleanup = () => {
    PostActions.cleanupPostActions();
    Gallery._clearPreloadCache();
    DownloadManager.cleanupWorker();
    UI.forceHideNotification();
    PreloadManager.clearQueue();
    ErrorHandler.clearRetries();
};

const init = async () => {
    try {
        const cssText = GM_getResourceText('mainCSS');
        if (cssText) GM_addStyle(cssText);
        await ResourceLoader.init();
        LazyLoader.init();
        Slideshow.init();
        const allSettings = SettingsManager.loadAllSettings();
        Object.assign(state, allSettings);
        if (state.enablePersistentCaching) initDexie();
        CONFIG.MAX_SCALE = SettingsManager.loadSetting('maxZoomScale', CONFIG.MAX_SCALE);

        GM_addStyle(`
            .post__actions, .scrape__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 5px 8px; }
            .post__actions > a, .scrape__actions > a { margin: 2px 0 !important; }
            .ug-button-container { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; margin-bottom: 5px; }
            .ug-button { white-space: nowrap; }
            .is-transitioning { transition: transform 0.3s ease-out; }
            .ug-image-error-message { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffcccc; background: rgba(0,0,0,0.7); padding: 10px 20px; border-radius: 5px; z-index: 5; }
            .${CSS.GALLERY.MAIN_VIDEO} { max-width: 100%; max-height: 100%; display: block; }
            .${CSS.GALLERY.MAIN_IMG_CONTAINER} { transform-origin: center center; backface-visibility: hidden; perspective: 1000px; }
            .${CSS.GALLERY.MAIN_IMG_CONTAINER}.${CSS.GALLERY.ZOOMED} { will-change: transform; }
            .${CSS.GALLERY.MAIN_IMG} { transform-origin: center center; backface-visibility: hidden; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges; }
            @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) { .${CSS.GALLERY.MAIN_IMG} { image-rendering: auto; } }
            .${CSS.NOTIF_AREA} {top: ${state.notificationPosition === 'top' ? '10px' : 'auto'}; bottom: ${state.notificationPosition === 'bottom' ? '10px' : 'auto'};}
        `);

        document.addEventListener('keydown', EventHandlers.handleGlobalKeyDown);
        window.addEventListener('beforeunload', fullCleanup);
        const debouncedInject = Utils.debounce(injectUI, 150);
        const observer = new MutationObserver(debouncedInject);
        observer.observe(document.body, { childList: true, subtree: true });
        injectUI();

        const originalShowExpandedView = Gallery.showExpandedView;
        Gallery.showExpandedView = function(index) {
            originalShowExpandedView.call(this, index);
            setTimeout(() => { ThumbnailStrip.init(); ThumbnailStrip.updateThumbnailNumbers(); }, 100);
        };
        const originalPopulateAllThumbnails = Gallery._populateAllThumbnails;
        Gallery._populateAllThumbnails = function($gridThumbnailsContainer, $stripThumbnailsContainer) {
            originalPopulateAllThumbnails.call(this, $gridThumbnailsContainer, $stripThumbnailsContainer);
            setTimeout(() => { ThumbnailStrip.updateThumbnailNumbers(); }, 50);
        };
    } catch (error) {
        console.error('Error in init:', error);
    }
};

init();
})();