// ==UserScript==
// @name         NodeSeekLinkOptimizer
// @license      AGPL-3.0
// @namespace    http://www.nodeseek.com/
// @version      2025-09-28
// @description  Optimize Nodeseek Links and clean signature content.
// @author       xykt
// @match        https://www.nodeseek.com/*
// @match        https://nodeseek.com/*
// @match        https://www.deepflood.com/*
// @match        https://deepflood.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @downloadURL https://update.greasyfork.org/scripts/536531/NodeSeekLinkOptimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/536531/NodeSeekLinkOptimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const PARAMS_TO_REMOVE = ['ref', 'aff', 'rc', 'affid', 'u', 'nci', 'aff_code', 'affiliate'];
    const ROOT_PARAMS_TO_REMOVE = ['code', 'kwd'];
    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        let href = link.getAttribute('href');
        if (!href) continue;
        if (href.startsWith('/jump?to=')) {
            try {
                const decodedUrl = decodeURIComponent(href.substring('/jump?to='.length));
                href = decodedUrl;
                link.href = decodedUrl;
                link.title = decodedUrl;
            } catch (e) {
                continue;
            }
        }
        const linkText = link.textContent || '';
        const containsAff = linkText.toLowerCase().includes('aff');
        if (!containsAff) {
            try {
                const url = new URL(href, window.location.origin);
                const params = url.searchParams;
                let shouldUpdate = false;
                let hasTitle = link.title && link.title.trim() !== '';
                if (url.hostname.toLowerCase() === 't.me') {
                    for (const [key] of params) {
                        if (key.toLowerCase() === 'start') {
                            params.delete(key);
                            shouldUpdate = true;
                        }
                    }
                }
                for (const [key] of params) {
                    const lowerKey = key.toLowerCase();
                    if (PARAMS_TO_REMOVE.includes(lowerKey)) {
                        params.delete(key);
                        shouldUpdate = true;
                    }
                }
                if (url.pathname === '/') {
                    for (const [key] of params) {
                        const lowerKey = key.toLowerCase();
                        if (ROOT_PARAMS_TO_REMOVE.includes(lowerKey)) {
                            params.delete(key);
                            shouldUpdate = true;
                        }
                    }
                }
                if (shouldUpdate) {
                    link.href = url.href;
                    if (hasTitle) {
                        link.title = url.href;
                    }
                }
            } catch (e) {
                continue;
            }
        }
    }
    const signatureDivs = document.querySelectorAll('div.signature');
    signatureDivs.forEach(div => {
        const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6, p, br');
        headings.forEach(heading => {
            const fragment = document.createDocumentFragment();
            while (heading.firstChild) {
                fragment.appendChild(heading.firstChild);
            }
            heading.parentNode.replaceChild(fragment, heading);
        });
        const childNodes = Array.from(div.childNodes);
        div.innerHTML = '';
        const p = document.createElement('p');
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
                return;
            }
            p.appendChild(node.cloneNode(true));
        });
        div.appendChild(p);
    });
})();