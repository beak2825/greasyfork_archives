// ==UserScript==
// @name         YouTube True Theater Mode
// @namespace    azb-truetheater
// @version      0.4
// @description  Apply a custom css when you enter theater mode in YouTube, hiding everything except the video.
// @author       Azb
// @match        https://www.youtube.com/watch*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487233/YouTube%20True%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/487233/YouTube%20True%20Theater%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyCustomStyles() {
        const customCSS = `
            ytd-watch-flexy[theater] #full-bleed-container.ytd-watch-flexy {
                height: 100vh;
                max-height: none;
            }
        #masthead-container.ytd-app {
            margin-top: 0px;
            padding-bottom: 5px;
            opacity: 0;
            transition: margin 0ms, padding 0ms, opacity 400ms;
        }
        #masthead-container.ytd-app:hover {
            margin-top: 0;
            padding-bottom: 0;
            opacity: 1;
            background: #0f0f0f;
        }
        #page-manager.ytd-app {
            margin-top: -6px;
        }
        ytd-feed-filter-chip-bar-renderer[fluid-width] #chips-content.ytd-feed-filter-chip-bar-renderer {
            display: none !important;
        }
    `;
        const styleElement = document.createElement('style');
        styleElement.textContent = customCSS;
        styleElement.id = 'custom-youtube-styles';
        document.head.appendChild(styleElement);
    }


    function removeCustomStyles() {
        const styleElement = document.querySelector('#custom-youtube-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }

    function handleTheaterModeChange(mutations) {
        const theaterAttribute = mutations[0].target.getAttribute('theater');
        if (theaterAttribute !== null) {
            applyCustomStyles();
        } else {
            removeCustomStyles();
        }
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'theater') {
                handleTheaterModeChange([mutation]);
            }
        });
    });

    function observePage() {
        const targetNode = document.documentElement;
        if (targetNode) {
            observer.observe(targetNode, {
                attributes: true,
                subtree: true
            });
        }
    }

    observePage();

    if (document.querySelector('ytd-watch-flexy').hasAttribute('theater')) {
        applyCustomStyles();
    }
})();