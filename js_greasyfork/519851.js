// ==UserScript==
// @name         SubDL Enhanced - Dark Theme + Image Previews
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Combined script: Forces dark theme, displays image previews on hover and beside titles with configuration options
// @author       dr.bobo0
// @license      MIT
// @match        https://subdl.com/*
// @match        https://*.subdl.com/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAgCAMAAADdXFNzAAAAXVBMVEVHcEz/7ir/7ir/7ir/7ir/7ir/7ir/7in/7ir/7ir/7ir/7ir/7Sr/7ir/7ir/7ir/9Sn/8iopKjMxMTMdIDMKEDSDfDBkXzH/+inBtS3bzSzSxC1GRDLs3SuZkC8BXe1rAAAAD3RSTlMAmpG5qyvRFvBGY9wGycP/EwDKAAABG0lEQVQokX2Ti5KDIAxFUSmgtg1P6/v/P3NFB0y03TvjjPFAIjeEsSzZ8FaBankj2V21gFOivtDnG6jeT4wfcNcD5f6CAer/duMMPzDAgXmOtYnSJsWcZl982DXmBbFClXd31lm7PR+dPlW4euRd12G+/UGDue11PwfEG1Zg7hdjpumsDwUTmLvZwHaC84SCqfxuxrDV7okDCpujh+D8ShcQ8/rVuzBowhWO9Me6sKD6ir1IOpidcyh8sZJgs3jiT4l7r7UGM3nMa+qv1aafqb9neyMfpxHz2GCJuPPeO3fy/aKnDpgh+KiwJl4cFyhZYKZhV8IqDU4+3SGS/fcFRgMg1Y0qOoTFBRfX+ZQcUf5tglldVqIVVYmH9w/WzDC9Fj6LqQAAAABJRU5ErkJggg==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519851/SubDL%20Enhanced%20-%20Dark%20Theme%20%2B%20Image%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/519851/SubDL%20Enhanced%20-%20Dark%20Theme%20%2B%20Image%20Previews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== DARK THEME SECTION =====
    // Force dark theme immediately
    function initDarkTheme() {
        try {
            localStorage.setItem('theme', 'dark');
        } catch (e) {
            console.error("SubDL Enhanced: Failed to set localStorage", e);
        }

        const applyDarkStyles = () => {
            if (document.documentElement) {
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                document.documentElement.style.colorScheme = 'dark';
            }
        };

        applyDarkStyles();

        if (!document.documentElement || !document.documentElement.classList.contains('dark')) {
            const observer = new MutationObserver((mutationsList, obs) => {
                if (document.documentElement) {
                    applyDarkStyles();
                    obs.disconnect();
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }
    }

    // Initialize dark theme immediately
    initDarkTheme();

    // ===== IMAGE PREVIEW CONFIGURATION =====
    const DEFAULT_CONFIG = {
        imageWidth: 75,
        imageHeight: 112,
        isSquare: false,
        hideDownloadButton: false,
        enableHoverPreview: true,
        enableBesidePreview: true
    };

    function getSettings() {
        return {
            imageWidth: GM_getValue('imageWidth', DEFAULT_CONFIG.imageWidth),
            imageHeight: GM_getValue('imageHeight', DEFAULT_CONFIG.imageHeight),
            isSquare: GM_getValue('isSquare', DEFAULT_CONFIG.isSquare),
            hideDownloadButton: GM_getValue('hideDownloadButton', DEFAULT_CONFIG.hideDownloadButton),
            enableHoverPreview: GM_getValue('enableHoverPreview', DEFAULT_CONFIG.enableHoverPreview),
            enableBesidePreview: GM_getValue('enableBesidePreview', DEFAULT_CONFIG.enableBesidePreview)
        };
    }

    function saveSettings(settings) {
        Object.keys(settings).forEach(key => {
            GM_setValue(key, settings[key]);
        });
    }

    // ===== SHARED UTILITIES =====
    const storagePrefix = "subdl_image_cache_";
    const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 days

    const exclusionList = [
        '/', '/panel', '/panel/my-subtitles', '/panel/account', '/panel/api',
        '/latest', '/popular', 'https://t.me/subdl_com', '/ads', '/api-doc',
        '/panel/logout', '/login', '#', '/signup'
    ];

    function safeJSONParse(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            localStorage.removeItem(key);
            return null;
        }
    }

    function clearOldCache() {
        const now = Date.now();
        Object.keys(localStorage)
            .filter(key => key.startsWith(storagePrefix))
            .forEach(key => {
                const item = safeJSONParse(key);
                if (!item || now - item.timestamp > maxCacheAge) {
                    localStorage.removeItem(key);
                }
            });
    }

    function getImageConfig() {
        const settings = getSettings();
        return {
            IMAGE_STYLES: {
                width: `${settings.imageWidth}px`,
                height: `${settings.imageHeight}px`,
                objectFit: settings.isSquare ? 'cover' : 'contain',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                marginRight: '8px'
            },
            LINK_STYLES: {
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }
        };
    }

    function applyStyles(element, styles) {
        Object.entries(styles).forEach(([key, value]) => {
            element.style[key] = value;
        });
    }

    function createElement(tag, styles = {}, attributes = {}) {
        const element = document.createElement(tag);
        applyStyles(element, styles);
        Object.entries(attributes).forEach(([key, value]) => {
            element[key] = value;
        });
        return element;
    }

    // ===== HOVER PREVIEW SECTION =====
    function shouldAddPreview(link) {
        const href = link.href;
        return !exclusionList.some(exclusion => href.endsWith(exclusion)) && /subdl.com/.test(href);
    }

    function createPreviewContainer() {
        const previewContainer = document.createElement("div");
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
            backgroundColor: "#21293b"
        });
        return previewContainer;
    }

    function showLoadingSpinner(previewContainer) {
        previewContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; background-color: #2d3748;">
                <div style="width: 40px; height: 40px; border: 4px solid #4a5568; border-top: 4px solid #718096; border-radius: 50%; animation: spin 1s linear infinite;"></div>
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

    function fetchImageForHover(url, previewContainer) {
        const cacheKey = storagePrefix + url;
        const cachedImage = safeJSONParse(cacheKey);

        if (cachedImage && Date.now() - cachedImage.timestamp < maxCacheAge) {
            setImage(previewContainer, cachedImage.src);
            return;
        }

        fetch(url)
            .then(response => response.text())
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const preview = doc.querySelector("div.select-none img");
                if (preview) {
                    const src = preview.getAttribute("src");
                    setImage(previewContainer, src);
                    try {
                        localStorage.setItem(cacheKey, JSON.stringify({ src, timestamp: Date.now() }));
                    } catch (e) {
                        clearOldCache();
                    }
                } else {
                    setError(previewContainer, "Image not found.");
                }
            })
            .catch(() => setError(previewContainer, "Failed to load image."));
    }

    function setImage(previewContainer, src) {
        previewContainer.innerHTML = `<img style="width: 100%; height: 100%; object-fit: cover;" src="${src}"/>`;
        previewContainer.style.display = "block";
        previewContainer.style.opacity = 1;
    }

    function setError(previewContainer, message) {
        previewContainer.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; color: #fc8181; font-weight: bold; text-align: center; background-color: #2d3748;">
                ${message}
            </div>
        `;
        previewContainer.style.display = "block";
        previewContainer.style.opacity = 1;
    }

    function addMousemoveListener(previewContainer) {
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
        return () => document.removeEventListener("mousemove", movePreview);
    }

    function cleanupPreview(previewContainer, removeMousemoveListener) {
        previewContainer.style.opacity = 0;
        setTimeout(() => {
            if (previewContainer.parentNode) {
                previewContainer.remove();
            }
            removeMousemoveListener();
        }, 200);
    }

    function addHoverPreviewToLinks() {
        if (!getSettings().enableHoverPreview) return;

        const links = document.querySelectorAll('a[href*="/s/info/"]:not([data-hover-preview])');

        links.forEach(link => {
            if (shouldAddPreview(link)) {
                link.setAttribute('data-hover-preview', 'true');
                link.addEventListener("mouseover", function () {
                    const previewContainer = createPreviewContainer();
                    document.body.appendChild(previewContainer);
                    showLoadingSpinner(previewContainer);
                    fetchImageForHover(this.href, previewContainer);

                    const removeMousemoveListener = addMousemoveListener(previewContainer);

                    const handleMouseout = () => cleanupPreview(previewContainer, removeMousemoveListener);
                    const handleClick = () => cleanupPreview(previewContainer, removeMousemoveListener);

                    link.addEventListener("mouseout", handleMouseout, { once: true });
                    link.addEventListener("click", handleClick, { once: true });
                });
            }
        });
    }

    // ===== BESIDE PREVIEW SECTION =====
    async function fetchImageForBeside(url, container) {
        const fullUrl = new URL(url, window.location.origin).href;
        const cacheKey = storagePrefix + fullUrl;

        const cachedImage = safeJSONParse(cacheKey);
        if (cachedImage && Date.now() - cachedImage.timestamp < maxCacheAge) {
            displayImageBeside(cachedImage.src, container);
            return;
        }

        try {
            const response = await fetch(fullUrl);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const preview = doc.querySelector("div.select-none img");

            if (preview) {
                const src = preview.getAttribute("src");
                if (src) {
                    displayImageBeside(src, container);
                    localStorage.setItem(cacheKey, JSON.stringify({
                        src: src,
                        timestamp: Date.now()
                    }));
                }
            }
        } catch (error) {
            console.error(`Failed to fetch image for ${fullUrl}:`, error);
        }
    }

    function displayImageBeside(src, container) {
        const CONFIG = getImageConfig();
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Preview";
        img.setAttribute('data-subdl-preview', 'true');

        Object.entries(CONFIG.IMAGE_STYLES).forEach(([key, value]) => {
            img.style[key] = value;
        });

        img.onerror = () => {
            img.src = 'https://subdl.com/images/poster.jpeg';
        };

        container.parentElement.insertBefore(img, container);
    }

    function addBesideImagePreviews() {
        if (!getSettings().enableBesidePreview) return;

        const links = document.querySelectorAll('a[href^="/s/info/"]:not([data-beside-preview])');
        const CONFIG = getImageConfig();

        links.forEach(link => {
            link.setAttribute('data-beside-preview', 'true');

            const container = link.querySelector('h3');
            if (!container) return;

            applyStyles(link, CONFIG.LINK_STYLES);
            const parentDiv = link.closest('.flex');
            if (parentDiv) {
                applyStyles(parentDiv, {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                });
            }

            const svgIcon = link.querySelector('svg');
            if (svgIcon) {
                applyStyles(svgIcon, {
                    width: '20px',
                    height: '20px',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                });
            }

            fetchImageForBeside(link.href, container);
        });
    }

    // ===== SETTINGS MODAL =====
    const COLORS = {
        background: '#1a202c',
        modalBg: '#2d3748',
        primary: '#4299e1',
        secondary: '#718096',
        accent: '#48bb78',
        textPrimary: '#e2e8f0',
        textSecondary: '#a0aec0',
        borderColor: '#4a5568'
    };

    function createSettingsModal() {
        const backdrop = createElement('div', {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '10000',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        });

        const modal = createElement('div', {
            background: COLORS.modalBg,
            padding: '30px',
            borderRadius: '16px',
            width: '500px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            position: 'relative',
            maxHeight: '80vh',
            overflowY: 'auto'
        });

        const title = createElement('h2', {
            color: COLORS.primary,
            marginBottom: '25px',
            textAlign: 'center',
            fontWeight: '700',
            fontSize: '1.5rem'
        }, { textContent: 'SubDL Enhancement Settings' });
        modal.appendChild(title);

        const settings = getSettings();

        // Preview Container
        const previewContainer = createElement('div', {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '25px',
            background: COLORS.background,
            padding: '25px',
            borderRadius: '12px'
        });
        modal.appendChild(previewContainer);

        const previewImg = createElement('img', {
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }, { src: 'https://via.placeholder.com/150x225?text=Preview' });
        previewContainer.appendChild(previewImg);

        const settingsContainer = createElement('div', {
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        });
        modal.appendChild(settingsContainer);

        // Preview Mode Toggles
        const previewModesContainer = createElement('div', {
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
        });

        const hoverToggleContainer = createElement('div', {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        });

        const hoverToggle = createElement('input', {
            accentColor: COLORS.primary
        }, {
            type: 'checkbox',
            id: 'hoverPreviewToggle',
            checked: settings.enableHoverPreview
        });

        const hoverToggleLabel = createElement('label', {
            color: COLORS.textSecondary
        }, {
            htmlFor: 'hoverPreviewToggle',
            textContent: 'Enable Hover Previews'
        });

        hoverToggleContainer.appendChild(hoverToggle);
        hoverToggleContainer.appendChild(hoverToggleLabel);

        const besideToggleContainer = createElement('div', {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        });

        const besideToggle = createElement('input', {
            accentColor: COLORS.primary
        }, {
            type: 'checkbox',
            id: 'besidePreviewToggle',
            checked: settings.enableBesidePreview
        });

        const besideToggleLabel = createElement('label', {
            color: COLORS.textSecondary
        }, {
            htmlFor: 'besidePreviewToggle',
            textContent: 'Enable Beside Title Previews'
        });

        besideToggleContainer.appendChild(besideToggle);
        besideToggleContainer.appendChild(besideToggleLabel);

        previewModesContainer.appendChild(hoverToggleContainer);
        previewModesContainer.appendChild(besideToggleContainer);
        settingsContainer.appendChild(previewModesContainer);

        // Image Width Slider
        const widthContainer = createElement('div');
        const widthLabel = createElement('label', {
            display: 'flex',
            justifyContent: 'space-between',
            color: COLORS.textPrimary,
            fontWeight: '600'
        });

        const widthLabelText = createElement('span', {}, { textContent: 'Image Width' });
        const widthValue = createElement('span', {}, { textContent: `${settings.imageWidth}px` });
        widthLabel.appendChild(widthLabelText);
        widthLabel.appendChild(widthValue);

        const widthSlider = createElement('input', {
            width: '100%',
            accentColor: COLORS.primary
        }, {
            type: 'range',
            min: '50',
            max: '200',
            value: settings.imageWidth
        });

        function updatePreview() {
            const width = widthSlider.value;
            const height = width * (squareToggle.checked ? 1 : 1.5);

            widthValue.textContent = `${width}px`;
            previewImg.style.width = `${width}px`;
            previewImg.style.height = `${height}px`;

            document.querySelectorAll('img[data-subdl-preview]').forEach(img => {
                img.style.width = `${width}px`;
                img.style.height = `${height}px`;
            });
        }

        widthSlider.oninput = updatePreview;

        widthContainer.appendChild(widthLabel);
        widthContainer.appendChild(widthSlider);
        settingsContainer.appendChild(widthContainer);

        // Square Images Toggle
        const squareToggleContainer = createElement('div', {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        });

        const squareToggle = createElement('input', {
            accentColor: COLORS.primary
        }, {
            type: 'checkbox',
            id: 'squareImagesToggle',
            checked: settings.isSquare
        });

        const squareToggleLabel = createElement('label', {
            color: COLORS.textSecondary
        }, {
            htmlFor: 'squareImagesToggle',
            textContent: 'Square Images'
        });

        squareToggle.oninput = () => {
            const width = widthSlider.value;
            const height = width * (squareToggle.checked ? 1 : 1.5);

            previewImg.style.height = `${height}px`;

            document.querySelectorAll('img[data-subdl-preview]').forEach(img => {
                img.style.height = `${height}px`;
                img.style.objectFit = squareToggle.checked ? 'cover' : 'contain';
            });
        };

        squareToggleContainer.appendChild(squareToggle);
        squareToggleContainer.appendChild(squareToggleLabel);
        settingsContainer.appendChild(squareToggleContainer);

        // Download Button Toggle
        const downloadToggleContainer = createElement('div', {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        });

        const downloadToggle = createElement('input', {
            accentColor: COLORS.primary
        }, {
            type: 'checkbox',
            id: 'hideDownloadToggle',
            checked: settings.hideDownloadButton
        });

        const downloadToggleLabel = createElement('label', {
            color: COLORS.textSecondary
        }, {
            htmlFor: 'hideDownloadToggle',
            textContent: 'Hide Download Buttons'
        });

        downloadToggle.oninput = () => {
            const downloadButtons = document.querySelectorAll('a[href^="https://dl.subdl.com/subtitle/"]');
            downloadButtons.forEach(button => {
                button.style.display = downloadToggle.checked ? 'none' : '';
            });
        };

        downloadToggleContainer.appendChild(downloadToggle);
        downloadToggleContainer.appendChild(downloadToggleLabel);
        settingsContainer.appendChild(downloadToggleContainer);

        // Buttons
        const buttonContainer = createElement('div', {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '25px',
            gap: '15px'
        });

        const saveButton = createElement('button', {
            backgroundColor: COLORS.accent,
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            flexGrow: '1',
            fontWeight: '600'
        }, { textContent: 'Save Settings' });

        saveButton.onclick = () => {
            const newSettings = {
                imageWidth: parseInt(widthSlider.value),
                imageHeight: parseInt(widthSlider.value) * (squareToggle.checked ? 1 : 1.5),
                isSquare: squareToggle.checked,
                hideDownloadButton: downloadToggle.checked,
                enableHoverPreview: hoverToggle.checked,
                enableBesidePreview: besideToggle.checked
            };
            saveSettings(newSettings);
            document.body.removeChild(backdrop);

            // Apply settings immediately
            applyDownloadButtonVisibility();
            refreshPreviews();
        };

        const cancelButton = createElement('button', {
            backgroundColor: COLORS.background,
            color: COLORS.textSecondary,
            border: `2px solid ${COLORS.background}`,
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            flexGrow: '1',
            fontWeight: '600'
        }, { textContent: 'Cancel' });

        cancelButton.onclick = () => {
            document.body.removeChild(backdrop);
        };

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        settingsContainer.appendChild(buttonContainer);

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        updatePreview();
    }

    // ===== UTILITY FUNCTIONS =====
    function applyDownloadButtonVisibility() {
        const settings = getSettings();
        const downloadButtons = document.querySelectorAll('a[href^="https://dl.subdl.com/subtitle/"]');
        downloadButtons.forEach(button => {
            button.style.display = settings.hideDownloadButton ? 'none' : '';
        });
    }

    function refreshPreviews() {
        // Remove existing previews
        document.querySelectorAll('img[data-subdl-preview]').forEach(img => img.remove());
        document.querySelectorAll('a[data-beside-preview]').forEach(link => link.removeAttribute('data-beside-preview'));
        document.querySelectorAll('a[data-hover-preview]').forEach(link => link.removeAttribute('data-hover-preview'));

        // Re-add previews
        addHoverPreviewToLinks();
        addBesideImagePreviews();
    }

    function throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    // ===== INITIALIZATION =====
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initFeatures);
        } else {
            initFeatures();
        }
    }

    function initFeatures() {
        clearOldCache();
        addHoverPreviewToLinks();
        addBesideImagePreviews();
        applyDownloadButtonVisibility();

        const throttledUpdate = throttle(() => {
            addHoverPreviewToLinks();
            addBesideImagePreviews();
            applyDownloadButtonVisibility();
        }, 500);

        const observer = new MutationObserver(() => {
            throttledUpdate();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Register menu command
    GM_registerMenuCommand('Configure SubDL Enhancements', createSettingsModal);

    // Start the script
    init();
})();