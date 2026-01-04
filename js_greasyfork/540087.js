// ==UserScript==
// @name         Instant Preview for search Results
// @namespace    http://tampermonkey.net/
// @version      2025-06-25
// @description  Instant Preview
// @author       Kushal Shakya
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @match        ://*/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540087/Instant%20Preview%20for%20search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/540087/Instant%20Preview%20for%20search%20Results.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let previewEnabled = true;

    const allowedDomains = [
        'wikipedia.org',
        'stackoverflow.com',
        'developer.mozilla.org',
        'github.com',
        'npmjs.com'
    ];

    const blockedDomains = [
        'facebook.com',
        'youtube.com',
        'linkedin.com',
        'instagram.com'
    ];

    const toggle = document.createElement('button');
    toggle.textContent = '🧩 Preview: ON';
    Object.assign(toggle.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 14px',
        zIndex: 10000,
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#333',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)'
    });
    document.body.appendChild(toggle);

    toggle.addEventListener('click', () => {
        previewEnabled = !previewEnabled;
        toggle.textContent = `🧩 Preview: ${previewEnabled ? 'ON' : 'OFF'}`;
        iframe.style.display = 'none';
    });

    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        width: '420px',
        height: '320px',
        zIndex: 9999,
        display: 'none',
        border: '2px solid #ccc',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        backgroundColor: '#fff',
        borderRadius: '4px',
        overflow: 'hidden'
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '25px',
        height: '25px',
        cursor: 'pointer',
        zIndex: 10000
    });
    closeBtn.onclick = () => {
        container.style.display = 'none';
        iframe.src = '';
    };

    const iframe = document.createElement('iframe');
    Object.assign(iframe.style, {
        width: '100%',
        height: '100%',
        border: 'none'
    });
    iframe.onerror = () => {
        iframe.srcdoc = `<div style="padding:1em; font-family:sans-serif;">❌ Cannot load preview. Site may block iframes.</div>`;
    };

    container.appendChild(closeBtn);
    container.appendChild(iframe);
    document.body.appendChild(container);

    function debounce(fn, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    let hoverTimeout;

    function attachPreviewListeners() {
        const links = document.querySelectorAll('a[href^="http"]:not([data-preview-added])');

        links.forEach(link => {
            const url = link.href;
            link.setAttribute('data-preview-added', 'true');

            link.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => {
                    if (!previewEnabled) return;

                    const isBlocked = blockedDomains.some(domain => url.includes(domain));
                    const isAllowed = allowedDomains.some(domain => url.includes(domain));

                    if (isBlocked || !isAllowed) {
                        container.style.display = 'none';
                        return;
                    }

                    iframe.src = url;
                    container.style.display = 'block';
                }, 500);
            });

            link.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
            });
        });
    }

    const observer = new MutationObserver(() => {
        attachPreviewListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    attachPreviewListeners();
})();