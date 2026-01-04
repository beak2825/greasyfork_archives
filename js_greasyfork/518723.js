// ==UserScript==
// @name         Add and Format Release Types to New Music
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Add release type with formatting and dynamic placement; handle dynamically loaded content, support tab switching.
// @author       Skeebadoo
// @match        https://rateyourmusic.com/new-music/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518723/Add%20and%20Format%20Release%20Types%20to%20New%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/518723/Add%20and%20Format%20Release%20Types%20to%20New%20Music.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const releaseTypeStyles = {
        album: { name: 'Album', color: '#E74C3C' }, // Bright red
        ep: { name: 'EP', color: '#E67E22' }, // Orange
        djmix: { name: 'DJ Mix', color: '#9B59B6' }, // Purple
        mixtape: { name: 'Mixtape', color: '#3498DB' }, // Bright Blue
        musicvideo: { name: 'Music Video', color: '#09Bd99' }, // Turquoise
        video: { name: 'Video', color: '#3DCC6D' }, // Green
        single: { name: 'Single', color: '#F3B712' }, // Yellow-Orange
        unauth: { name: 'Bootleg', color: '#7F8C8D' }, // Subdued grey
        comp: { name: 'Compilation', color: '#95A5A6' }, // Subdued light grey
        additional: { name: 'Additional', color: '#BDC3C7' } // Soft grey
    };

    function getSubtleTint(baseColor) {
        const rgb = parseInt(baseColor.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        const tintFactor = 0.05;
        const blendedR = Math.round(r * tintFactor + 28 * (1 - tintFactor));
        const blendedG = Math.round(g * tintFactor + 28 * (1 - tintFactor));
        const blendedB = Math.round(b * tintFactor + 28 * (1 - tintFactor));
        return `rgb(${blendedR}, ${blendedG}, ${blendedB})`;
    }

    function addReleaseType(container) {
        const releaseBoxes = container.querySelectorAll('.newreleases_itembox:not(.processed)');
        releaseBoxes.forEach((box) => {
            box.classList.add('processed');
            const releaseLink = box.querySelector('.newreleases_item_title');
            if (releaseLink) {
                const href = releaseLink.getAttribute('href');
                const releaseTypeMatch = href.match(/\/release\/([^/]+)\//);
                if (releaseTypeMatch) {
                    const releaseType = releaseTypeMatch[1];
                    const style = releaseTypeStyles[releaseType];
                    if (style) {
                        const releaseTypeSpan = document.createElement('span');
                        releaseTypeSpan.textContent = style.name;
                        releaseTypeSpan.style.color = style.color;
                        releaseTypeSpan.style.fontWeight = 'bold';
                        releaseTypeSpan.style.fontSize = '0.9em';
                        releaseTypeSpan.style.marginRight = '10px';
                        const artistContainer = box.querySelector('.newreleases_item_artist');
                        if (artistContainer) {
                            artistContainer.insertAdjacentElement('afterend', releaseTypeSpan);
                        }
                        box.style.backgroundColor = getSubtleTint(style.color);
                        box.style.borderRadius = '5px';
                        box.style.padding = '10px';
                    }
                }
            }
        });
    }

    function observeDynamicContent(container) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    addReleaseType(container);
                }
            });
        });
        observer.observe(container, { childList: true });
        return observer;
    }

    function initialize() {
        let activeContainer = document.getElementById('newreleases_items_container_new_releases_all');
        let observer = observeDynamicContent(activeContainer);

        document.getElementById('selector_new_releases_personal').addEventListener('click', () => {
            observer.disconnect();
            activeContainer = document.getElementById('newreleases_items_container_new_releases_personal');
            addReleaseType(activeContainer);
            observer = observeDynamicContent(activeContainer);
        });

        document.getElementById('selector_new_releases_all').addEventListener('click', () => {
            observer.disconnect();
            activeContainer = document.getElementById('newreleases_items_container_new_releases_all');
            addReleaseType(activeContainer);
            observer = observeDynamicContent(activeContainer);
        });

        addReleaseType(activeContainer); // Initial processing
    }

    initialize();
})();
