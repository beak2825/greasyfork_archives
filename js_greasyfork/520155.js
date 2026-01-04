// ==UserScript==
// @name         Youtube Undistract
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Youtube less distracting
// @author       DA25
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @license.     MIT 
// @downloadURL https://update.greasyfork.org/scripts/520155/Youtube%20Undistract.user.js
// @updateURL https://update.greasyfork.org/scripts/520155/Youtube%20Undistract.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urlCheckIntervalId = null;
    let lastUrl = '';
    let stopListening;
    let lastPageName;
    let currentPageName;

    const watchVideoPage = {
        name: 'watchVideoPage',
        matches: (document) => {
            const url = document.location.href;
            const regex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]+.*$/;
            return regex.test(url);
        },
        init: (document) => {
            console.log('watchVideoPage: init');
            if (lastPageName === currentPageName) {
                console.log(`Same page: ${currentPageName}, not doing anything`);
                return;
            }
            const hideContentStyles = `
                div#secondary div#secondary-inner {
                    opacity: 0;
                    transition: opacity .25s ease-in-out 0s;
                }
                div#secondary:hover div#secondary-inner {
                    opacity: 1;
                    transition: opacity .25s ease-in-out 0.5s;
                }

                ytd-comments#comments ytd-item-section-renderer#sections {
                    opacity: 0;
                    transition: opacity .25s ease-in-out 0s;
                }
                ytd-comments#comments:hover ytd-item-section-renderer#sections {
                    opacity: 1;
                    transition: opacity .25s ease-in-out 0.5s;
                }

                ytd-compact-video-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer) {
                    opacity: 0.05;
                    transition: opacity .25s ease-in-out 0s;
                }
                ytd-compact-video-renderer:has(ytd-thumbnail-overlay-resume-playback-renderer):hover {
                    opacity: 1;
                    transition: opacity .25s ease-in-out 0.5s;
                }

                .ytp-heat-map-container {
                    display: block !important;
                    opacity: 1 !important;
                }

                #contents ytd-reel-shelf-renderer {
                    display: none
                }
           `;
            const scrollRelatedStyles = `
                div#related:has(ytd-watch-next-secondary-results-renderer) {
                    overflow-y: scroll;
                    outline: 1px solid white;
                    max-height: calc(var(--ytd-watch-flexy-panel-max-height) + var(--ytd-watch-flexy-space-below-player) + var(--ytd-watch-flexy-masthead-height));
                }
            `;

            GM_addStyle(hideContentStyles);
            GM_addStyle(scrollRelatedStyles);

            const scrollHandlerBuilder = (element) => (event) => {
                const deltaY = event.deltaY;
                const contentHeight = element.scrollHeight;
                const visibleHeight = element.offsetHeight;
                const scrollTop = element.scrollTop;

                if ((scrollTop === 0 && deltaY < 0) || ((scrollTop + visibleHeight + 0.5 >= contentHeight) && deltaY > 0)) {
                    event.preventDefault();
                }
            };

            const addScrollListener = (element) => {
                console.log('addScrollListener');
                const scrollHandler = scrollHandlerBuilder(element);
                element.addEventListener('wheel', scrollHandler, { passive: false });
                return () => {
                    console.log('removeScrollListener');
                    element.removeEventListener('wheel', scrollHandler);
                }
            };

            const startListening = () => {
                console.log('enter: startListening');
                if (stopListening) {
                    try {
                        stopListening();
                    } catch(e) {
                        console.error(e);
                    } finally {
                        stopListening = undefined;
                    }
                }
                const relatedVideosContainerEle = document.querySelector('div#related:has(ytd-watch-next-secondary-results-renderer)');
                if (relatedVideosContainerEle) {
                    stopListening = addScrollListener(relatedVideosContainerEle);
                }
            };

            setTimeout(() => startListening(), 4000);
        },
        destroy: () => {
        }
    }

    const homePage = {
        name: 'homePage',
        matches: (document) => {
            const url = document.location.href;
            const regex = /^https:\/\/www\.youtube\.com\/?$/;
            return regex.test(url);
        },
        init: (document) => {
//             document.location.href = 'https://www.youtube.com/playlist?list=WL'
        },
        destroy: () => {}
    };

    const pages = [
        watchVideoPage,
        homePage
    ];

    const startListenPageUrlChange = (callback) => {
        console.log('startListenPageUrlChange');
        if (urlCheckIntervalId === null) {
            lastUrl = document.location.href;

            urlCheckIntervalId = setInterval(() => {
                const currentUrl = document.location.href;
                console.log('checking if page changed', currentUrl !== lastUrl);
                if (currentUrl !== lastUrl) {
                    callback(lastUrl, currentUrl);
                    lastUrl = currentUrl;
                }
            }, 4000); // Check every 1000 milliseconds (1 second)
        }
    }

    const stopListenPageUrlChange = () => {
        console.log('stopListenPageUrlChange');
        if (urlCheckIntervalId !== null) {
            clearInterval(urlCheckIntervalId);
            urlCheckIntervalId = null;
        }
    }

    const checkMatchingPage = () => {
        console.log('checkMatchingPage');
        const matchingPage = pages.find((page) => page.matches(document));

        if (matchingPage) {
            console.log('Matching page found: ', matchingPage.name);
            lastPageName = currentPageName;
            currentPageName = matchingPage.name;
            const lastPage = pages.find((page) => page.name === lastPageName);
            if (lastPage) {
                lastPage.destroy();
            }
            matchingPage.init(document);
        } else {
            console.log('No matching page found');
        }
    }

    const pageChangeHandler = (lastUrl, currentUrl) => {
        console.log('pageChangeHandler: Url Changed: ', currentUrl);
        checkMatchingPage();
    }

    const init = () => {
        console.log('init');
        checkMatchingPage();
    }

    init();
    startListenPageUrlChange(pageChangeHandler)
})();