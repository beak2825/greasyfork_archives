// ==UserScript==
// @name         GaiaOnline Avatar Try-On Resizer
// @namespace    https://www.gaiaonline.com/profiles/jasska
// @version      2.1
// @author       Jasska
// @description  Resizes item try on preview to 3x.
// @match        https://www.gaiaonline.com/marketplace/itemdetail/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534043/GaiaOnline%20Avatar%20Try-On%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/534043/GaiaOnline%20Avatar%20Try-On%20Resizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS to override Gaia's styles
    GM_addStyle(`
        #img_avatar_preview {
            width: 122px !important;
            height: 152px !important;
            min-width: unset !important;
            min-height: unset !important;
            max-width: unset !important;
            max-height: unset !important;
        }
    `);

    const IFRAME_ID = 'img_avatar_preview';
    const CHECK_INTERVAL = 500;
    let currentIframe = null;

    // Dimensions (matches Gaia's original size)
    const sizes = {
        default: { width: '120px', height: '150px' },
        enlarged: { width: '360px', height: '450px' }
    };

    function applyPixelatedStyle(img) {
        img.style.setProperty('image-rendering', 'crisp-edges', 'important');
        img.style.setProperty('image-rendering', 'pixelated', 'important');
    }

    function performResize(iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        const avatarImg = iframeDoc.querySelector('.oldavatar');
        const img = iframeDoc.querySelector('.oldavatar img');
        if (!img) return;
        if (!avatarImg) return;

        applyPixelatedStyle(img); // Reapply styles

        const size = sizes.enlarged;

        // Resize image
        avatarImg.style.width = size.width;
        avatarImg.style.height = size.height;

        // Force iframe resize
        iframe.style.cssText = `
                    width: ${size.width} !important;
                    height: ${size.height} !important;
                    border: 0;
                `;

        currentIframe = iframe;
    }

    function reactToImageUpdates() {
        const iframe = document.getElementById(IFRAME_ID);
        if (!iframe) return;

        // 1. Wait for iframe to load (initial load)
        iframe.onload = function() {
            // 2. Wait for .oldavatar to exist inside the iframe
            const checkForAvatar = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const avatarImg = iframeDoc.querySelector('.oldavatar');

                    if (!avatarImg) {
                        setTimeout(checkForAvatar, 100); // Retry in 100ms
                        return;
                    }

                    // 3. Now that avatarImg exists, set up MutationObserver
                    const observer = new MutationObserver((mutations) => {
                        mutations.forEach((mutation) => {
                            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                                console.log("Avatar src updated - resizing");
                                performResize(iframe);
                            }
                            // If the entire image is replaced (not just src change)
                            if (mutation.type === 'childList') {
                                console.log("Avatar element replaced - resizing");
                                performResize(iframe);
                            }
                        });
                    });

                    // Watch for changes to avatarImg
                    observer.observe(avatarImg, {
                        attributes: true,
                        attributeFilter: ['src'],
                        childList: true,
                        subtree: true
                    });

                    console.log("here");

                    // Initial resize
                    performResize(iframe);

                } catch (e) {
                    console.error("Error setting up observer:", e);
                }
            };

            checkForAvatar(); // Start checking for avatarImg
        };

        // If iframe is already loaded, trigger manually
        if (iframe.contentDocument?.readyState === 'complete') {
            iframe.onload(); // Force trigger
        }
    }

    reactToImageUpdates();

})();