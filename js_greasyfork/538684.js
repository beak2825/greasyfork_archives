// ==UserScript==
// @name         Show XXX Photos on TS Dating
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Display XXX Photos on TS Dating for free.
// @author       myngre
// @match        https://www.ts-dating.com/model/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ts-dating.com
// @grant        none
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/538684/Show%20XXX%20Photos%20on%20TS%20Dating.user.js
// @updateURL https://update.greasyfork.org/scripts/538684/Show%20XXX%20Photos%20on%20TS%20Dating.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function convertImages() {
        console.log('[TS-Fix] convertImages() triggered.');

        const a_reg_pic = document.querySelector("div.photos-block__item > a[data-lightbox='normalpics']");
        if (!a_reg_pic) {
            console.warn('[TS-Fix] No regular photo <a> found');
            return;
        }
        const img_reg_pic = a_reg_pic.querySelector('img');
        if (!img_reg_pic) {
            console.warn('[TS-Fix] No image inside regular photo <a> found');
            return;
        }

        const as2convert = document.querySelectorAll("div.photos-block__item > a[data-lightbox='adultpics']");
        as2convert.forEach(a_conv_elem => {
            console.log('[TS-Fix] Converting', a_conv_elem);
            if (a_conv_elem.href.includes("memberpics")){
                console.log("Already converted", a_conv_elem)
                return;
            }
            const match = a_conv_elem.href.match(/Iname=[^&]*-(\d+)/);
            if (!match) {
                console.error('[TS-Fix] Invalid URL in href:', a_conv_elem.href);
                return;
            }

            const image_number = match[1];
            console.log('[TS-Fix] Extracted image number:', image_number);

            const new_href = a_reg_pic.href.replace(/\d+(?=\.jpg)/, image_number);
            a_conv_elem.href = new_href;

            const img_conv_elem = a_conv_elem.querySelector('img');
            if (!img_conv_elem) {
                console.warn('[TS-Fix] No <img> found inside <a> — skipping', a_conv_elem);
                return;
            }
            const new_src = img_reg_pic.src.replace(/\d+(?=\.jpg)/, image_number);
            const new_data_src = img_reg_pic.getAttribute('data-src').replace(/\d+(?=\.jpg)/, image_number);

            if (img_conv_elem) {
                img_conv_elem.src = new_href;
                // Update lazyload fallback
                img_conv_elem.setAttribute('data-src', new_data_src);
            }
        });
    }

    function handleActiveTab(li) {
        console.log(`[TS-Fix] handleActiveTab called for LI: "${li.textContent.trim()}", class="${li.className}"`);
        if (li && li.tagName === 'LI' && li.textContent.includes("HOT Photos") && li.classList.contains("active")) {
            console.log('[TS-Fix] HOT Photos tab is active - running convertImages()');
            setTimeout(convertImages, 500);
        }
    }

    function observeLiAttributes(li) {
        console.log(`[TS-Fix] Attaching attribute observer to LI: "${li.textContent.trim()}"`);
        const attrObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    handleActiveTab(mutation.target);
                }
            });
        });
        attrObserver.observe(li, { attributes: true, attributeFilter: ['class'] });
    }

    function observeTabList(container) {
        console.log('[TS-Fix] Attaching main MutationObserver to tab list container.');
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'LI') {
                            observeLiAttributes(node);
                            handleActiveTab(node);
                        }
                    });
                } else if (mutation.type === 'attributes' && mutation.target.tagName === 'LI' && mutation.attributeName === 'class') {
                    handleActiveTab(mutation.target);
                }
            });
        });

        observer.observe(container, {
            childList: true,
            subtree: false,
            attributes: true,
            attributeFilter: ['class'],
        });

        container.querySelectorAll('li').forEach(li => observeLiAttributes(li));

        console.log('[TS-Fix] MutationObserver attached to tab list and existing <li> elements.');
    }

    function findCorrectTabList() {
        const uls = document.querySelectorAll('ul.tab-list.d-flex');
        console.log(`[TS-Fix] Found ${uls.length} UL.tab-list.d-flex elements.`);
        for (let i = 0; i < uls.length; i++) {
            const ul = uls[i];
            const liTexts = [...ul.children].map(li => li.textContent.trim());
            console.log(`[TS-Fix] UL[${i}] LI texts:`, liTexts);

            if (liTexts.some(text => text.includes('HOT Photos'))) {
                console.log(`[TS-Fix] Using UL[${i}] as tab list container.`);
                return ul;
            }
        }
        console.warn('[TS-Fix] No UL.tab-list.d-flex containing "HOT Photos" found.');
        return null;
    }

    function waitForTabList(retries = 20) {
        const container = findCorrectTabList();
        if (container) {
            observeTabList(container);
        } else if (retries > 0) {
            console.log('[TS-Fix] Waiting for tab list container...');
            setTimeout(() => waitForTabList(retries - 1), 500);
        } else {
            console.warn('[TS-Fix] Tab list container did not appear in time.');
        }
    }

    window.addEventListener('load', () => {
        console.log('[TS-Fix] Page loaded, starting to wait for tab list container...');
        waitForTabList();
    });
})();