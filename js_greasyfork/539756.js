// ==UserScript==
// @name         Auto-clean ChatGPT Tracking Links
// @namespace    Violentmonkey userscripts by ReporterX
// @version      6.0
// @description  It offers two modes. It intelligently auto-cleans tracking links (i.e. links with tracking parameters) when you load the page by observing DOM additions and attribute changes, checking links in dynamic contents etc. It also includes a draggable button for manual cleaning in case if some links are left uncleaned.
// @author       ReporterX
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539756/Auto-clean%20ChatGPT%20Tracking%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/539756/Auto-clean%20ChatGPT%20Tracking%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const trackingParams = new Set([
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
        'gclid', 'dclid', 'gclsrc', 'wbraid', 'gbraid', '_ga', '_gl', 'fbclid', 'igshid',
        'msclkid', 'mc_cid', 'mc_eid', '_hsenc', '_hsmi', 'hsCtaTracking', 'srsltid',
        'trk', '__tn__', '__cft__', '__biz', 'mkt_tok', 'vero_conv', 'vero_id', 'ef_id',
        's_kwcid', 'pk_campaign', 'pk_kwd', 'piwik_campaign', 'piwik_kwd', 'mtm_campaign',
        'matomo_campaign', 'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src',
        'hsa_net', 'hsa_ver', 'spm', 'yclid', 'ysclid', 'rb_clickid', 'zanpid',
        'cjevent', 'cjdata', 'cr_cc'
    ]);

    function getCleanedUrl(urlString) {
        if (!urlString || !urlString.includes('?')) return null;
        try {
            const url = new URL(urlString);
            let hasChanged = false;
            for (const param of trackingParams) {
                if (url.searchParams.has(param)) {
                    url.searchParams.delete(param);
                    hasChanged = true;
                }
            }
            return hasChanged ? url.toString() : null;
        } catch (e) {
            return null;
        }
    }

    function cleanLinksInElement(element) {
        if (!element || typeof element.querySelectorAll !== 'function') return 0;
        const links = element.querySelectorAll('a[href]');
        let cleanedCount = 0;
        links.forEach(link => {
            let wasCleaned = false;
            const cleanedHref = getCleanedUrl(link.href);
            if (cleanedHref) {
                link.href = cleanedHref;
                wasCleaned = true;
            }
            if (link.hasAttribute('alt')) {
                const cleanedAlt = getCleanedUrl(link.getAttribute('alt'));
                if (cleanedAlt) {
                    link.setAttribute('alt', cleanedAlt);
                    wasCleaned = true;
                }
            }
            if (wasCleaned) {
                cleanedCount++;
            }
        });
        return cleanedCount;
    }

    function createCleanButton() {
        const button = document.createElement('button');
        button.textContent = 'Clean Links';
        button.id = 'clean-links-button';
        document.body.appendChild(button);

        let isMouseDown = false, isDragging = false;
        let startX, startY, initialButtonX, initialButtonY;
        const dragThreshold = 5;

        button.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isMouseDown = true; isDragging = false;
            startX = e.clientX; startY = e.clientY;
            const rect = button.getBoundingClientRect();
            initialButtonX = rect.left; initialButtonY = rect.top;
            Object.assign(button.style, { bottom: 'unset', right: 'unset', top: `${initialButtonY}px`, left: `${initialButtonX}px`, cursor: 'grabbing' });
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            const deltaX = e.clientX - startX, deltaY = e.clientY - startY;
            if (!isDragging && Math.sqrt(deltaX**2 + deltaY**2) > dragThreshold) {
                isDragging = true;
            }
            if (isDragging) {
                Object.assign(button.style, { left: `${initialButtonX + deltaX}px`, top: `${initialButtonY + deltaY}px` });
            }
        });

        document.addEventListener('mouseup', () => {
            if (!isMouseDown) return;
            isMouseDown = false;
            button.style.cursor = 'pointer';
            if (isDragging) {
                GM_setValue('button_pos_x', button.style.left);
                GM_setValue('button_pos_y', button.style.top);
            }
        });

        button.addEventListener('click', () => {
            if (isDragging) return;
            const count = cleanLinksInElement(document.body);
            button.textContent = `Cleaned ${count} links.`; // <-- UPDATED TEXT
            button.disabled = true;
            setTimeout(() => {
                button.textContent = "Clean Links";
                button.disabled = false;
            }, 2500);
        });

        const savedX = GM_getValue('button_pos_x', null);
        const savedY = GM_getValue('button_pos_y', null);
        if (savedX && savedY) {
            Object.assign(button.style, { left: savedX, top: savedY, bottom: 'unset', right: 'unset' });
        }
    }

    function activateLiveCleaner() {
        const observer = new MutationObserver((mutationsList) => {
            let newlyCleanedCount = 0;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            newlyCleanedCount += cleanLinksInElement(node);
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    if (mutation.target.nodeType === Node.ELEMENT_NODE) {
                        newlyCleanedCount += cleanLinksInElement(mutation.target);
                    }
                }
            }
            if (newlyCleanedCount > 0) {
                console.log(`[Userscript] Auto-cleaned ${newlyCleanedCount} link(s) due to page update.`);
            }
        });

        const observerConfig = {
            childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class']
        };

        observer.observe(document.body, observerConfig);
        console.log('[Userscript] Ultimate automatic link cleaner is active.');
    }

    GM_addStyle(`
        #clean-links-button {
            position: fixed; bottom: 15px; left: 15px; z-index: 9999;
            background-color: #202123; color: #ececec; border: 1px solid #4d4d4f;
            border-radius: 8px; padding: 8px 12px; font-size: 14px; cursor: pointer;
            transition: background-color 0.3s, color 0.3s; user-select: none; white-space: nowrap;
        }
        #clean-links-button:hover { background-color: #343541; }
        #clean-links-button:disabled { background-color: #1a4731; color: #999; cursor: not-allowed; }
    `);

    window.addEventListener('load', () => {
        const initialCleanCount = cleanLinksInElement(document.body);
        if (initialCleanCount > 0) {
             console.log(`[Userscript] Initial page scan cleaned ${initialCleanCount} link(s).`);
        }
        createCleanButton();
        activateLiveCleaner();
    });
})();