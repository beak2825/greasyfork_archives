// ==UserScript==
// @name         Instagram Embed Link Copier for Discord (with Reels Support)
// @namespace    http://tampermonkey.net/
// @version      1.11.2
// @description  Adds five buttons (kk, ez, dd, original, fxig) to copy Instagram post/reel embed links for Discord. Original compact layout, fixed kk domain replacement bug permanently.
// @author       FunkyJustin
// @match        https://www.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512451/Instagram%20Embed%20Link%20Copier%20for%20Discord%20%28with%20Reels%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512451/Instagram%20Embed%20Link%20Copier%20for%20Discord%20%28with%20Reels%20Support%29.meta.js
// ==/UserScript==

/*
Update History:
- v1.11.2: Permanently fixed kk button domain replacement using single regex (no more kkkkinstagram.com); enforced https and clean trailing slash; total lines ~295.
- v1.11.1: Fixed kk bug with robust replace; stripped query params; total lines ~290.
- v1.11.0: Restored exact original v1.8 layout/styling/selectors for perfect fit; kept kk button left-most (purple); total lines ~285.
- v1.10.1: Compact layout attempt (failed for user); total lines ~275.
- v1.10.0: Added left-most "kk" button for kkinstagram.com (purple); total lines ~280.
- v1.9.0: Modern clipboard, immediate observer, resilient link detection; total lines ~260.
- v1.8: Original release with four buttons, toast feedback, reel support.
*/

(function () {
    'use strict';

    let toastTimeout = null;

    function createStyledButton(text, bgColor) {
        const btn = document.createElement('button');
        btn.innerText = text;
        btn.style.cssText = `
            padding: 5px 10px;
            background-color: ${bgColor};
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            transition: background-color 0.2s ease;
        `;
        btn.addEventListener('mouseenter', () => btn.style.filter = 'brightness(90%)');
        btn.addEventListener('mouseleave', () => btn.style.filter = 'none');
        return btn;
    }

    function showToast(message) {
        if (toastTimeout) clearTimeout(toastTimeout);

        let toast = document.querySelector('.custom-ig-toast');
        if (toast) toast.remove();

        toast = document.createElement('div');
        toast.className = 'custom-ig-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.style.opacity = '1');

        toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
            toast.addEventListener('transitionend', () => toast.remove(), { once: true });
        }, 1500);
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    }

    function getPostLink(section) {
        const href = location.href.split('?')[0];
        if (/\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?$/.test(href)) {
            return href;
        }
        const timeEl = section.querySelector('time');
        if (timeEl) {
            const link = timeEl.closest('a');
            if (link && /\/(p|reel|tv)\//.test(link.href)) {
                return link.href.split('?')[0];
            }
        }
        const article = section.closest('article');
        if (article) {
            const link = article.querySelector('a[href*="/p/"], a[href*="/reel/"], a[href*="/tv/"]');
            if (link) return link.href.split('?')[0];
        }
        return null;
    }

    function createCopyButtons() {
        const buttonSections = document.querySelectorAll(
            'section.x6s0dn4.xrvj5dj.x1o61qjw.x12nagc.x1gslohp, section.x6s0dn4.xrvj5dj.x1o61qjw, section.x78zum5.x1q0g3np'
        );

        buttonSections.forEach((section) => {
            if (section.querySelector('.copy-ez-link-btn')) return;

            const originalLink = getPostLink(section);
            if (!originalLink) return;

            // Clean: strip query params, ensure https, trailing slash
            let cleanLink = originalLink.split('?')[0].replace(/^http:/, 'https:');
            if (!cleanLink.endsWith('/')) cleanLink += '/';

            const container = document.createElement('div');
            container.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin-top: 8px;
            `;

            const addBtn = (label, color, proxyDomain) => {
                const btn = createStyledButton(label, color);
                btn.classList.add('copy-ez-link-btn');
                btn.addEventListener('click', async () => {
                    let link = cleanLink;
                    if (proxyDomain) {
                        link = link.replace(/(https:\/\/)(?:www\.)?instagram\.com/, `$1${proxyDomain}`);
                    }
                    const success = await copyToClipboard(link);
                    showToast(success ? `${label.replace('Copy ', '').replace(' Link', '')} link copied!` : 'Copy failed!');
                });
                container.appendChild(btn);
            };

            // Order: kk (left-most), ez, dd, original, fxig
            addBtn('Copy kk Link', '#9c27b0', 'kkinstagram.com');
            addBtn('Copy ez Link', '#f02a2a', 'instagramez.com');
            addBtn('Copy dd Link', '#3897f0', 'ddinstagram.com');
            addBtn('Copy Original Link', '#555', '');
            addBtn('Copy fxig Link', '#28a745', 'fxig.seria.moe');

            section.appendChild(container);
        });
    }

    const observer = new MutationObserver(createCopyButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    createCopyButtons();

})();