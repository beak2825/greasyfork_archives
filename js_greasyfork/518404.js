// ==UserScript==
// @name         CS.RIN.RU Button on SteamGifts
// @namespace    https://greasyfork.org/en/users/1384870
// @version      1.0
// @description  Adds a quick-access button to SteamGifts, allowing users to search for game topics directly on CS.RIN.RU (requires login to CS.RIN.RU).
// @author       Rastrisr
// @compatible   firefox
// @compatible   chrome
// @compatible   edge
// @match        https://www.steamgifts.com/*
// @license      MIT
// @icon         https://i.ibb.co/p1k6cq6/image.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518404/CSRINRU%20Button%20on%20SteamGifts.user.js
// @updateURL https://update.greasyfork.org/scripts/518404/CSRINRU%20Button%20on%20SteamGifts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ICON_URL = 'https://i.ibb.co/p1k6cq6/image.png';
    const SEARCH_URL = 'https://cs.rin.ru/forum/search.php';

    function createElement(tag, attributes = {}, styles = {}) {
        const element = document.createElement(tag);
        Object.assign(element, attributes);
        Object.assign(element.style, styles);
        return element;
    }

    function createSearchButton(appId) {
        const button = createElement(
            'a',
            {
                href: `${SEARCH_URL}?keywords=${appId}&fid%5B%5D=10&sr=topics&sf=firstpost`,
                target: '_blank',
            },
            {
                display: 'inline-flex',
                alignItems: 'center',
                marginLeft: '8px',
                textDecoration: 'none',
                position: 'relative',
            }
        );

        const icon = createElement(
            'img',
            { src: ICON_URL, alt: 'CS.RIN.RU' },
            { width: '16px', height: '16px', marginRight: '5px' }
        );

        const tooltip = createElement(
            'div',
            { textContent: 'Open in CS.RIN.RU' },
            {
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '5px 10px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                visibility: 'hidden',
                opacity: '0',
                zIndex: '1000',
                transition: 'opacity 0.2s ease, visibility 0s linear 0.2s',
            }
        );

        button.addEventListener('mouseenter', () => {
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = '0';
        });

        button.append(icon, tooltip);
        return button;
    }

    function addButtonsToHeadings(headings) {
        headings.forEach((heading) => {
            const steamLink = heading.querySelector('a[href*="store.steampowered.com/app/"]');
            if (!steamLink) return;

            const appId = steamLink.href.match(/app\/(\d+)/)?.[1];
            if (appId) heading.appendChild(createSearchButton(appId));
        });
    }

    function init() {
        const headings = document.querySelectorAll('h2.giveaway__heading, div.featured__heading');
        if (headings.length) addButtonsToHeadings(headings);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
