// ==UserScript==
// @name         RYM Toggle Sections (Issues, Credits, Lists)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Create a button to hide/show the issues, credits and lists sections on RateYourMusic
// @author       https://greasyfork.org/users/1320826-polachek
// @match        *://rateyourmusic.com/release/*
// @match        *://*.rateyourmusic.com/release/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538643/RYM%20Toggle%20Sections%20%28Issues%2C%20Credits%2C%20Lists%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538643/RYM%20Toggle%20Sections%20%28Issues%2C%20Credits%2C%20Lists%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .toggle-section-btn {
            background: var(--mono-fb);
            border: 1px solid #d0d0d0;
            border-radius: 3px;
            color: var(--mono-4);
            cursor: pointer;
            font-size: 11px;
            margin-left: 10px;
            padding: 2px 8px;
            vertical-align: middle;
            transition: all 0.2s ease;
        }
        .toggle-section-btn:hover {
            background: var(--mono-e);
        }
        .release_page_header {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Animação suave */
        .section-content {
            overflow: hidden;
            transition:
                max-height 0.5s ease-in-out,
                opacity 0.3s ease-in-out,
                padding 0.3s ease-in-out;
        }
        .rym-section.collapsed .section-content {
            max-height: 0 !important;
            opacity: 0;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
        }
        .rym-section:not(.collapsed) .section-content {
            max-height: 5000px; /* Valor grande o suficiente */
            opacity: 1;
            transition:
                max-height 0.5s ease-in-out,
                opacity 0.5s ease-in-out 0.1s,
                padding 0.3s ease-in-out;
        }
    `);

    function addToggleToSection(section, headerSelector) {
        const header = section.querySelector(headerSelector);
        if (!header) return;

        const btn = document.createElement('button');
        btn.className = 'toggle-section-btn';
        btn.textContent = 'Show';

        header.appendChild(btn);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'section-content';

        let nextElement = header.nextElementSibling;
        while (nextElement) {
            contentWrapper.appendChild(nextElement.cloneNode(true));
            nextElement.remove();
            nextElement = header.nextElementSibling;
        }

        header.parentNode.insertBefore(contentWrapper, header.nextSibling);

        section.classList.add('rym-section', 'collapsed');

        btn.addEventListener('click', () => {
            const wasCollapsed = section.classList.contains('collapsed');

            section.classList.toggle('collapsed');
            btn.textContent = section.classList.contains('collapsed') ? 'Show' : 'Hide';

            if (wasCollapsed) {
                contentWrapper.style.display = 'block';
                void contentWrapper.offsetHeight; 
            }
        });
    }

    function findIssueSections() {
        const sections = document.querySelectorAll('.page_section');
        return Array.from(sections).filter(section => {
            const header = section.querySelector('.release_page_header h2');
            return header && (header.textContent.includes('Issue') || header.textContent.includes('Issues'));
        });
    }

    function init() {
        const issueSections = findIssueSections();
        issueSections.forEach(section => {
            addToggleToSection(section, '.release_page_header');
        });

        const creditSections = document.querySelectorAll('.section_credits');
        creditSections.forEach(section => {
            addToggleToSection(section, '.release_page_header');
        });

        const listSections = document.querySelectorAll('.section_lists');
        listSections.forEach(section => {
            addToggleToSection(section, '.release_page_header');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();