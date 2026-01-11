// ==UserScript==
// @name         SpaceFrontiers Citation Converter
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  Converts citations to DOI links
// @author       Gemini
// @match        https://spacefrontiers.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539059/SpaceFrontiers%20Citation%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/539059/SpaceFrontiers%20Citation%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createConvertButton(container) {
        if (container.querySelector('.btn-convert-citation')) return;

        const btn = document.createElement('button');
        btn.innerText = 'Convert';
        btn.className = 'btn-convert-citation';

        Object.assign(btn.style, {
            marginLeft: '8px',
            padding: '2px 10px',
            fontSize: '13px',
            lineHeight: '20px',
            borderRadius: '12px',
            border: '1px solid #dadce0',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            fontFamily: 'Google Sans, Roboto, Arial, sans-serif',
            transition: 'all 0.1s',
            color: 'currentColor'
        });

        btn.onmouseenter = () => btn.style.backgroundColor = 'rgba(0,0,0,0.05)';
        btn.onmouseleave = () => btn.style.backgroundColor = 'transparent';

        btn.onclick = (e) => {
            e.preventDefault();
            convertCitations(container, btn);
        };

        container.appendChild(btn);
    }

    async function convertCitations(container, btn) {
        const markers = container.querySelectorAll('.reference-marker');

        for (let marker of markers) {
            const originalText = marker.innerText.trim();
            const formattedText = originalText.replace(/(\d+)/g, '[$1]');
            marker.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
            await new Promise(r => setTimeout(r, 200));
            const popup = document.querySelector('div[role="tooltip"].visible');
            if (popup) {
                const doiLink = popup.querySelector('a[href*="doi.org"]');
                if (doiLink) {
                    const newLink = document.createElement('a');
                    newLink.href = doiLink.href;
                    newLink.innerText = formattedText;
                    newLink.target = '_blank';
                    newLink.style.cssText = "color: #1a73e8; text-decoration: none; font-weight: 500; margin: 0 2px;";
                    newLink.onmouseenter = () => newLink.style.textDecoration = 'underline';
                    newLink.onmouseleave = () => newLink.style.textDecoration = 'none';

                    marker.parentNode.replaceChild(newLink, marker);
                }
            }
            marker.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        }
        btn.remove();
    }

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.citation-processed-content').forEach(createConvertButton);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();