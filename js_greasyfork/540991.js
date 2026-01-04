// ==UserScript==
// @name         Always Load HD Reddit Images
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1.1.2
// @description  Automatically replaces blurry Reddit image previews with their full-resolution originals as you scroll. Includes a menu command to toggle the feature on or off.
// @author       TheSina
// @match        https://*.reddit.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540991/Always%20Load%20HD%20Reddit%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/540991/Always%20Load%20HD%20Reddit%20Images.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
(async function () {
    'use strict';

    let enabled = await GM_getValue('hdEnabled', true);

    const updateMenu = () => {
        GM_registerMenuCommand(
            (enabled ? 'Disable' : 'Enable') + ' HD Images',
            async () => {
                enabled = !enabled;
                await GM_setValue('hdEnabled', enabled);
                location.reload();
            },
        );
    };
    updateMenu();

    const toHD = url => url.replace('preview.redd.it', 'i.redd.it');

    function upgradeImg(img) {
        if (!enabled) return;

        const src = img.getAttribute('src') || '';
        const current = img.currentSrc || '';

        // Skip link preview thumbnails
        if (
            src.includes('external-preview') ||
            current.includes('external-preview')
        )
            return;

        // Process only if the src is a standard preview
        if (!src.includes('preview.redd.it')) return;

        const srcset = img.getAttribute('srcset');
        if (srcset) {
            const candidates = srcset
                .split(',')
                .map(s => s.trim().split(' ')[0]);
            img.src = toHD(candidates[candidates.length - 1]);
        } else {
            img.src = toHD(src);
        }

        img.srcset = '';
    }

    function upgradeBg(el) {
        if (!enabled) return;

        const bg = getComputedStyle(el).backgroundImage;

        if (bg.includes('external-preview')) return;

        const m = bg.match(
            /url\(["']?(https?:\/\/preview\.redd\.it\/[^"')]+)["']?\)/,
        );
        if (m) {
            el.style.backgroundImage = `url("${toHD(m[1])}")`;
        }
    }

    const io = new IntersectionObserver(
        entries => {
            for (const {target, isIntersecting} of entries) {
                if (!isIntersecting) continue;

                if (target.tagName === 'IMG') upgradeImg(target);
                else upgradeBg(target);

                io.unobserve(target);
            }
        },
        {rootMargin: '200px'},
    );

    function observeNewElements(root) {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            null,
            false,
        );
        const elementsToObserve = [];
        let node = walker.currentNode;

        do {
            if (node.tagName === 'IMG' && !node.dataset.hdObserved) {
                node.dataset.hdObserved = '1';
                elementsToObserve.push(node);
            } else if (!node.dataset.hdBgObserved) {
                const style = node.getAttribute('style');
                if (
                    style &&
                    style.includes('background') &&
                    style.includes('preview.redd.it')
                ) {
                    node.dataset.hdBgObserved = '1';
                    elementsToObserve.push(node);
                }
            }
        } while ((node = walker.nextNode()));

        elementsToObserve.forEach(el => io.observe(el));
    }

    let mutationTimeout;
    const handleMutations = records => {
        clearTimeout(mutationTimeout);
        mutationTimeout = setTimeout(() => {
            const addedElements = [];

            for (const rec of records) {
                for (const node of rec.addedNodes) {
                    if (node instanceof HTMLElement) {
                        addedElements.push(node);
                    }
                }
            }

            addedElements.forEach(observeNewElements);
        }, 50);
    };

    const mo = new MutationObserver(handleMutations);
    mo.observe(document.body, {childList: true, subtree: true});

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', () =>
            observeNewElements(document.body),
        );
    } else {
        observeNewElements(document.body);
    }
})();
