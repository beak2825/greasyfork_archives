// ==UserScript==
// @name         YouTube Link Collector & Notebook Inserter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Collect YouTube links and insert them into Google Notebook
// @author       moony
// @license      MIT
// @match        https://www.youtube.com/*
// @match        https://notebooklm.google.com/notebook/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/525507/YouTube%20Link%20Collector%20%20Notebook%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/525507/YouTube%20Link%20Collector%20%20Notebook%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'ytLinks';
    let links = new Set();
    const DELAY = { SHORT: 1000, LONG: 2000 };

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function loadLinks() {
        try {
            links = new Set(GM_getValue(STORAGE_KEY, []));
        } catch (e) {
            console.error('Error loading links:', e);
        }
    }

    function findYoutubeChip() {
        const chipSelectors = [
            'mat-chip mat-icon[data-mat-icon-type="font"]',
            'mat-chip:has(mat-icon)',
            '.mat-mdc-chip:has(.google-symbols)'
        ];

        for (const selector of chipSelectors) {
            for (const el of document.querySelectorAll(selector)) {
                const chip = el.closest('mat-chip');
                if (chip?.textContent.includes('YouTube')) return chip;
            }
        }
        return null;
    }

    async function waitForElement(selector, timeout = 5000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = typeof selector === 'string'
                ? document.querySelector(selector)
                : selector();
            if (element) return element;
            await sleep(100);
        }
        throw new Error(`Timeout: ${selector}`);
    }

    async function insertNextLink() {
        const currentLinks = [...links];
        if (!currentLinks.length) return console.log('No links to process');

        try {
            // Add source
            const addBtn = await waitForElement('button[mattooltip="Ajouter une source"]');
            addBtn.click();
            await sleep(DELAY.SHORT);

            // YouTube chip
            const chip = await waitForElement(findYoutubeChip);
            (chip.querySelector('.mdc-evolution-chip__action') || chip).click();
            await sleep(DELAY.SHORT);

            // URL input
            const input = await waitForElement('input[formcontrolname="newUrl"]');
            const currentLink = currentLinks[0];
            input.value = currentLink;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await sleep(DELAY.SHORT);

            // Insert
            const insertBtn = await waitForElement('button[type="submit"].mdc-button--unelevated');
            insertBtn.click();
            await sleep(DELAY.LONG);

            links.delete(currentLink);
            GM_setValue(STORAGE_KEY, [...links]);

            await sleep(DELAY.LONG);
            insertNextLink();

        } catch (error) {
            console.error('Error:', error);
            await sleep(DELAY.LONG);
            insertNextLink();
        }
    }

    if (window.location.hostname === 'www.youtube.com') {
        const processElement = element => {
            element.querySelectorAll('a[href*="/watch?v="], a[href*="/shorts/"]')
                .forEach(link => {
                    const videoId = link.href?.match(/(?:\/watch\?v=|\/shorts\/)([^&?\s]+)/)?.[1];
                    if (videoId) {
                        links.add(`https://www.youtube.com/watch?v=${videoId}`);
                        GM_setValue(STORAGE_KEY, [...links]);
                    }
                });
        };

        loadLinks();
        processElement(document);
        new MutationObserver(mutations =>
            mutations.forEach(m =>
                m.addedNodes.forEach(n => n.nodeType === 1 && processElement(n))
            )
        ).observe(document.body, { childList: true, subtree: true });

    } else if (window.location.hostname === 'notebooklm.google.com') {
        loadLinks();
        GM_registerMenuCommand('Insert YouTube Links', insertNextLink);
    }
})();