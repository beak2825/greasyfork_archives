// ==UserScript==
// @name         Libgen Fiction - Hover Preview with Natural Zoom
// @namespace    https://github.com/source-guilherme
// @version      1.5
// @description  Hover over book titles on Libgen Fiction and preview covers with zooming ability. Fallback image if missing. Stable and smooth experience.
// @author       Source-Guilherme
// @match        https://libgen.is/fiction/*
// @grant        GM_xmlhttpRequest
// @connect      libgen.is
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534203/Libgen%20Fiction%20-%20Hover%20Preview%20with%20Natural%20Zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/534203/Libgen%20Fiction%20-%20Hover%20Preview%20with%20Natural%20Zoom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEFAULT_NO_COVER = 'https://via.placeholder.com/200x300?text=No+Cover';

    const previewImg = document.createElement('img');
    previewImg.style.position = 'fixed';
    previewImg.style.top = '0';
    previewImg.style.left = '0';
    previewImg.style.maxWidth = '200px';
    previewImg.style.maxHeight = '300px';
    previewImg.style.zIndex = '9999';
    previewImg.style.pointerEvents = 'none';
    previewImg.style.display = 'none';
    previewImg.style.opacity = '0';
    previewImg.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    previewImg.style.border = '1px solid #ccc';
    previewImg.style.background = '#fff';
    previewImg.style.transformOrigin = 'center center';
    document.body.appendChild(previewImg);

    const spinner = document.createElement('div');
    spinner.style.position = 'fixed';
    spinner.style.width = '30px';
    spinner.style.height = '30px';
    spinner.style.border = '3px solid #ccc';
    spinner.style.borderTop = '3px solid #333';
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    spinner.style.display = 'none';
    spinner.style.zIndex = '10000';
    document.body.appendChild(spinner);

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    const coverCache = {};
    let zoomLevel = 1;
    let hoveredLink = null;
    let currentRequestId = 0;

    function fetchCover(bookLink, callback) {
        if (coverCache[bookLink] !== undefined) {
            callback(coverCache[bookLink]);
            return;
        }

        const thisRequestId = ++currentRequestId;

        GM_xmlhttpRequest({
            method: 'GET',
            url: bookLink,
            onload: function(response) {
                if (thisRequestId !== currentRequestId) return;

                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const imgElement = doc.querySelector('div.record_side img');
                if (imgElement) {
                    const src = imgElement.getAttribute('src');
                    const fullImgSrc = new URL(src, bookLink).href;
                    coverCache[bookLink] = fullImgSrc;
                    callback(fullImgSrc);
                } else {
                    coverCache[bookLink] = DEFAULT_NO_COVER;
                    callback(DEFAULT_NO_COVER);
                }
            },
            onerror: function() {
                console.error('Failed to load book page:', bookLink);
                if (thisRequestId === currentRequestId) {
                    coverCache[bookLink] = DEFAULT_NO_COVER;
                    callback(DEFAULT_NO_COVER);
                }
            }
        });
    }

    function movePreview(e) {
        const padding = 20;
        let x = e.clientX + padding;
        let y = e.clientY + padding;
        if ((x + 200) > window.innerWidth) {
            x = e.clientX - 220;
        }
        if ((y + 300) > window.innerHeight) {
            y = e.clientY - 320;
        }
        previewImg.style.top = y + 'px';
        previewImg.style.left = x + 'px';
        spinner.style.top = (e.clientY + 10) + 'px';
        spinner.style.left = (e.clientX + 10) + 'px';
    }

    function getFullLink(link) {
        if (link.startsWith('http')) {
            return link;
        } else {
            return new URL(link, location.origin).href;
        }
    }

    function updateZoom() {
        previewImg.style.transform = `scale(${zoomLevel})`;
    }

    const links = document.querySelectorAll('table.catalog td:nth-child(3) a');

    links.forEach(link => {
        const bookLink = getFullLink(link.getAttribute('href'));

        link.addEventListener('mouseenter', (e) => {
            zoomLevel = 1;
            updateZoom();
            hoveredLink = link;
            currentRequestId++; // cancel previous request
            movePreview(e);

            // *** IMMEDIATELY clear preview ***
            previewImg.style.opacity = '0';
            previewImg.style.display = 'none';
            previewImg.src = '';
            spinner.style.display = 'block';

            fetchCover(bookLink, (coverUrl) => {
                if (hoveredLink === link) {
                    spinner.style.display = 'none';
                    if (coverUrl) {
                        previewImg.src = coverUrl;
                        previewImg.style.display = 'block';
                        requestAnimationFrame(() => {
                            previewImg.style.opacity = '1';
                        });
                    }
                }
            });
        });

        link.addEventListener('mousemove', movePreview);

        link.addEventListener('mouseleave', () => {
            hoveredLink = null;
            spinner.style.display = 'none';
            previewImg.style.opacity = '0';
            setTimeout(() => {
                if (!hoveredLink) {
                    previewImg.style.display = 'none';
                    previewImg.src = '';
                    zoomLevel = 1;
                    updateZoom();
                }
            }, 200);
        });
    });

    window.addEventListener('wheel', (e) => {
        if (hoveredLink && previewImg.style.display === 'block') {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomLevel += 0.1;
            } else {
                zoomLevel = Math.max(0.5, zoomLevel - 0.1);
            }
            updateZoom();
        }
    }, { passive: false });

})();
