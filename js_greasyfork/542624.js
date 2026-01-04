// ==UserScript==
// @name         hltv.watchparty.layout
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Clean up HLTV match pages, drag important parts, and apply a background gradient
// @author       2klex
// @match        https://www.hltv.org/matches/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542624/hltvwatchpartylayout.user.js
// @updateURL https://update.greasyfork.org/scripts/542624/hltvwatchpartylayout.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ❌ Elements to remove
    const selectorsToRemove = [
        'body > div.bgPadding > div.widthControl > div:nth-child(3) > div.right2Colbody > div.bgPadding > div.widthControl > div:nth-child(3) > div.right2Col',
        'body > div.bgPadding > div.widthControl > div.main-top.centered-placement.gtSmartphone-only',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div.right2Col',
        'body > div.bgPadding > div.widthControl > div.logoCon > div.BZ4Bl4KkTN > a > img.night-only',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div.contentCol > div.match-page > div.g-grid.maps > div.col-6.col-5-small',
        'body > div.bgPadding > div.widthControl > div.logoCon > div.center-container',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div.leftCol',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.stream-thumb-container',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.head-to-head',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.vrs-forecast-container.standard-box.text-ellipsis',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-comments',
        '#betting',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div:nth-child(11) > div',
        // mapstats
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.map-stats-infobox > div.map-stats-infobox-right > div.map-stats-infobox-header',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.map-stats-infobox > div.map-stats-infobox-right > div:nth-child(2)',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.map-stats-infobox > div.map-stats-infobox-right > div:nth-child(3)',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.map-stats-infobox > div.map-stats-infobox-right > div:nth-child(4)',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.map-stats-infobox',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.past-matches.spoiler',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.standard-box.teamsBox',
        'body > div.bgPadding > div.streams-section.gtSmartphone-only',
        'body > footer',
        'body > div.bgPadding > div.bg-sidebar.left.narrow.sticky-offset',
        'body > div.bgPadding > div.bg-sidebar.right.narrow.sticky-offset',
        'body > div.bgPadding > div.bg-sidebar.left.wide.sticky-offset',
        'body > div.bgPadding > div.bg-sidebar.right.wide.sticky-offset',
        '#map-stats',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > span:nth-child(19)',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > span:nth-child(22)',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > span:nth-child(18)',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > span:nth-child(21)',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > span',
        '#navBarContainerFull',
        '#scoreboardElement > div > div:nth-child(6)',
        //'#scoreboardElement > div > span',
        //'#scoreboardElement > div > div.hide-minimap-toggle.hide-minimap-disabled',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.standard-box.head-to-head-listing.spoiler',
        '#aniplayer_AV63497311a7f92432c14aa7c3-1750497844917 > avp-player-ui',
        'body > div.bgPadding > div.widthControl > div:nth-child(3) > div.contentCol > div.match-page > div.centered-placement.gtSmartphone-only > div > div',
        'body > div.bgPadding > div.widthControl > div:nth-child(3) > div.contentCol > div.match-page > div:nth-child(12) > div > a > img.night-only',
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div:nth-child(9) > div',
        '#cto_banner_content',
        'body > div.bgPadding > div.bg-sidebar.right.wide',
        'body > div.bgPadding > div.bg-sidebar.left.wide'
    ];

    // ✅ Elements to preserve from removal
    const selectorsToPreserve = [
        '#lineups',
        '.keep-this',
        // Add more here
    ];

    // 🔄 Elements to wrap into draggable containers
    const selectorsToWrap = [
        'body > div.bgPadding > div.widthControl > div:nth-child(2) > div > div.match-page > div.g-grid.maps > div',
        '#scoreboardElement > div > div.scoreboard',
        '#lineups',
        '#scoreboardElement > div > div:nth-child(5)',
        '#match-stats#match-stats',
        'body > div.bgPadding > div.widthControl > div.logoCon',
        // Add more selectors to wrap here
    ];

    // 🚫 Don't remove preserved elements
    function isPreserved(element) {
        return selectorsToPreserve.some(preserveSelector =>
            element.matches(preserveSelector) || element.closest(preserveSelector)
        );
    }
    // ❌ Remove elements unless preserved
    function removeElements() {
        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                if (!isPreserved(el)) {
                    el.remove();
                }
            });
        });
    }
    function setBackground() {
        const gradient = 'linear-gradient(to bottom, #333333 0%, #0cad9d 100%)';

        function applyBackground() {
            if (document.getElementById('custom-gradient-bg')) return; // avoid duplicates

            // Add a full-screen background gradient layer
            const bgLayer = document.createElement('div');
            bgLayer.id = 'custom-gradient-bg';
            Object.assign(bgLayer.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                backgroundImage: gradient,
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                zIndex: '-9999',
                pointerEvents: 'none'
            });
            document.body.insertAdjacentElement('afterbegin', bgLayer);

            // Inject strong CSS overrides for body/html
            const style = document.createElement('style');
            style.textContent = `
            html, body {
                background: transparent !important;
                background-image: none !important;
                background-color: transparent !important;
            }
            .bgPadding {
                background: transparent !important;
                background-color: transparent !important;
            }
            .hl-ui-overlay {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 100000;
                background: #222;
                color: white;
                padding: 8px;
                border-radius: 6px;
                font-family: sans-serif;
            }
            .hl-ui-overlay button {
                margin: 3px;
            }
            .hl-highlighted {
                outline: 2px solid yellow;
                cursor: move;
            }
        `;
            document.head.appendChild(style);
        }

        if (document.readyState === 'complete') {
            applyBackground();
        } else {
            window.addEventListener('load', applyBackground);
        }
    }
    // 📦 Wrap and drag selected elements
    function wrapElements() {
        selectorsToWrap.forEach((selector, index) => {
            document.querySelectorAll(selector).forEach((el, idx) => {
                if (el.closest('.wrapped-draggable')) return;

                const wrapper = document.createElement('div');
                wrapper.className = 'wrapped-draggable';
                const id = `wrapped-${index}-${idx}`;

                Object.assign(wrapper.style, {
                    position: 'fixed',
                    left: el.getBoundingClientRect().left + window.scrollX + 'px',
                    top: el.getBoundingClientRect().top + window.scrollY + 'px',
                    zIndex: '10000',
                    background: '#00000',
                    color: '#fff',
                    width: el.offsetWidth + 'px',
                    height: el.offsetHeight + 'px',
                    resize: 'none',
                    boxSizing: 'border-box'
                });

                el.parentElement.insertBefore(wrapper, el);
                wrapper.appendChild(el);
                restorePosition(id, wrapper);
                makeDraggable(wrapper, id);
            });
        });
    }

    // 🧲 Drag + Save
    function makeDraggable(el, id) {
        el.style.cursor = 'move';

        el.addEventListener('mousedown', function (e) {
            e.preventDefault();
            let shiftX = e.clientX - el.getBoundingClientRect().left;
            let shiftY = e.clientY - el.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                el.style.left = (pageX - shiftX) + 'px';
                el.style.top = (pageY - shiftY) + 'px';
            }

            function onMouseMove(e) {
                moveAt(e.pageX, e.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            el.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                el.onmouseup = null;
                savePosition(id, el);
            };
        });

        el.ondragstart = () => false;
    }

    function savePosition(id, el) {
        localStorage.setItem('wrap-pos-' + id, JSON.stringify({
            left: el.style.left,
            top: el.style.top
        }));
    }

    function restorePosition(id, el) {
        const saved = localStorage.getItem('wrap-pos-' + id);
        if (saved) {
            try {
                const pos = JSON.parse(saved);
                el.style.left = pos.left;
                el.style.top = pos.top;
            } catch (e) {
                console.warn('Failed to restore wrapper position:', id);
            }
        }
    }

    function loadLayoutFromJson() {
    // Paste your exported layout here
    const layoutJson = {
        "wrap-pos-wrapped-5-0": "{\"left\":\"20.918px\",\"top\":\"68.8398px\"}",
        "wrap-pos-wrapped-0-0": "{\"left\":\"5.39931px\",\"top\":\"131.875px\"}",
        "wrap-pos-wrapped-4-0": "{\"left\":\"2149.88px\",\"top\":\"332.875px\"}",
        "wrap-pos-wrapped-2-0": "{\"left\":\"1182.38px\",\"top\":\"39.1562px\"}",
        "wrap-pos-wrapped-1-0": "{\"left\":\"398.344px\",\"top\":\"37.875px\"}"
        // Add more if needed
    };

    for (const [key, value] of Object.entries(layoutJson)) {
        localStorage.setItem(key, value);
        console.log('[LAYOUT LOADED]', key, value);
    }
    }


    // 🔁 Run on load
    function runAll() {
        loadLayoutFromJson();
        setBackground();
        removeElements();
        wrapElements();
    }


    window.addEventListener('load', runAll);

    // 🔍 Dynamic DOM handling
    const observer = new MutationObserver(runAll);
    observer.observe(document.body, { childList: true, subtree: true });
})();
