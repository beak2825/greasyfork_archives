// ==UserScript==
// @name         Zoom on Hover
// @name:es      Zoom on Hover
// @version      1.7.5
// @description  Zoom on Hover enlarges images when you hover over them.
// @description:es Zoom on Hover amplía las imágenes cuando pasas el cursor sobre ellas.
// @author       Adam Jensen
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/en/scripts/518810-zoom-on-hover
// @downloadURL https://update.greasyfork.org/scripts/518810/Zoom%20on%20Hover.user.js
// @updateURL https://update.greasyfork.org/scripts/518810/Zoom%20on%20Hover.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('DOMContentLoaded', (event) => {

        'use strict';

    // Configuration
    const MAX_WIDTH = 500;  // Maximum width of the enlarged image
    const MAX_HEIGHT = 450; // Maximum height of the enlarged image
    const ZOOM_FACTOR = 2.5;  // Zoom factor (1x, 1.5x, 2x, 3x, etc)
    const MAX_SIZE = 2000;   // Maximum size in pixels (If an image has width or height greater than or equal to MAX_SIZE, it won't be enlarged)
    const MIN_SIZE = 40;    // Minimum size in pixels (Images smaller than this size won't be enlarged)
    const MAX_DISPLAY_TIME = 5;  // Maximum duration (in seconds) for how long the enlarged image stays visible

    // Styles
    GM_addStyle(`
        .ampliar-img-flotante {
            position: absolute;
            z-index: 9999;
            border: 2px solid rgba(204, 204, 204, 0.5);
            background: rgba(255, 255, 255, 0.9);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            display: none;
            padding: 0px;
            pointer-events: none;
            height: auto;
            width: auto;
            box-sizing: border-box;
        }
        .ampliar-img-flotante img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
            margin: 0;
            box-sizing: border-box;
        }
    `);

    // Create the floating window
    const ventanaFlotante = document.createElement('div');
    ventanaFlotante.classList.add('ampliar-img-flotante');
    const imagenFlotante = document.createElement('img');
    ventanaFlotante.appendChild(imagenFlotante);
    document.body.appendChild(ventanaFlotante);

    let timer; // Timer to hide the floating window after a while
    let justShown = false;

    // Function to enlarge the image with the zoom factor
    const ampliarImagen = (event) => {
        const target = event.target;

        let imgSrc = '';

        if (target.tagName === 'IMG') {
            // If the element is an <img>, use the src attribute
            imgSrc = target.src;

            // Skip images with "logo" or "icon" in the alt attribute
            const altText = target.alt ? target.alt.toLowerCase() : '';
            if (altText.includes('logo') || altText.includes('icon')) {
                return;
            }

        } else if (target.style.backgroundImage) {

            const rawSrc = target.style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            imgSrc = decodeURIComponent(rawSrc);
        }

        if (!imgSrc) {
            return;
        }

        if (imagenFlotante.src === imgSrc) {
            return;
        }

        ocultarVentanaFlotante();

        const img = new Image();
        img.onload = () => {
            // Don't enlarge images that are already large enough
            if (target.clientWidth >= MAX_SIZE || target.clientHeight >= MAX_SIZE) {
                return;
            }

            // Don't enlarge images that are too small
            if (target.clientWidth < MIN_SIZE || target.clientHeight < MIN_SIZE) {
                return;
            }

            const widthWithZoom = img.width * ZOOM_FACTOR;
            const heightWithZoom = img.height * ZOOM_FACTOR;

            let finalWidth, finalHeight;

            if (img.width > img.height) {
                finalWidth = Math.min(widthWithZoom, MAX_WIDTH);
                finalHeight = (img.height * finalWidth) / img.width;
                if (finalHeight > MAX_HEIGHT) {
                    finalHeight = MAX_HEIGHT;
                    finalWidth = (img.width * finalHeight) / img.height;
                }
            } else {
                finalHeight = Math.min(heightWithZoom, MAX_HEIGHT);
                finalWidth = (img.width * finalHeight) / img.height;
                if (finalWidth > MAX_WIDTH) {
                    finalWidth = MAX_WIDTH;
                    finalHeight = (img.height * finalWidth) / img.width;
                }
            }

            ventanaFlotante.style.background = 'transparent';
            ventanaFlotante.style.border = 'none';

            imagenFlotante.src = imgSrc;
            ventanaFlotante.style.display = 'block';
            ventanaFlotante.style.width = `${finalWidth}px`;
            ventanaFlotante.style.height = `${finalHeight}px`;

            const { top, left, width, height } = target.getBoundingClientRect();
            let newTop = top + window.scrollY;
            let newLeft = left + width + window.scrollX;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            if (newLeft + ventanaFlotante.offsetWidth > viewportWidth) {
                newLeft = left - ventanaFlotante.offsetWidth + window.scrollX;
            }

            if (newTop + ventanaFlotante.offsetHeight > viewportHeight + window.scrollY) {
                newTop = top + height + window.scrollY - ventanaFlotante.offsetHeight;
            }

            if (newTop < window.scrollY) {
                newTop = window.scrollY;
            }

            ventanaFlotante.style.top = `${newTop}px`;
            ventanaFlotante.style.left = `${newLeft}px`;

            clearTimeout(timer);
            timer = setTimeout(ocultarVentanaFlotante, MAX_DISPLAY_TIME * 1000);

            justShown = true;
            setTimeout(() => { justShown = false; }, 200);
        };
        img.src = imgSrc;
    };

    const ocultarVentanaFlotante = () => {
        if (justShown) {
            return;
        }
        ventanaFlotante.style.display = 'none';
        imagenFlotante.src = '';
    };

    const addListenersToElement = (target) => {
        if (!target.dataset.zoomOnHoverAttached) {
            target.addEventListener('mouseenter', ampliarImagen);
            target.addEventListener('mouseleave', ocultarVentanaFlotante);
            target.dataset.zoomOnHoverAttached = 'true';
        }
    };

    // Detect images
    const detectarImagenes = () => {
        const elements = document.querySelectorAll('img, [style*="background-image"]');
        elements.forEach(addListenersToElement);
    };

    detectarImagenes();

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    addListenersToElement(node);
                    node.querySelectorAll('img, [style*="background-image"]').forEach(addListenersToElement);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    if (window.location.hostname.includes('youtube.com')) {
        window.addEventListener('mouseover', function(event) {
            if (event.target.closest('ytd-thumbnail')) {
                event.stopImmediatePropagation();
            }
        }, true);
    }
    });
})();
