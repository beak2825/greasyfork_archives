// ==UserScript==
// @name         fudium
// @namespace    https://github.com/ThoriqFathurrozi/
// @version      1.202512231766489569
// @description  Tampermonkey/Greasemonkey script hack for Medium articles – zaps paywalls overlays nags so you can read without the noise. Not affiliated with Medium. Use at your own risk.
// @author       frrzyriq
// @match        https://medium.com
// @match        https://*.medium.com/*
// @match        https://*/*
// @icon         https://miro.medium.com/v2/5d8de952517e8160e40ef9841c781cdc14a5db313057fa3c3de41c6f5b494b19
// @grant        none
// @run-at       document-end
// @noframes
// @homepageURL  https://github.com/ThoriqFathurrozi/fudium
// @updateURL_DEV    http://127.0.0.1::7000/fudium.meta.js
// @downloadURL_DEV  http://127.0.0.1::7000/fudium.user.js
// @license      MIT; https://raw.githubusercontent.com/ThoriqFathurrozi/fudium/refs/heads/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/547238/fudium.user.js
// @updateURL https://update.greasyfork.org/scripts/547238/fudium.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    const SERVICE_REGISTRY = Object.freeze({
        FREEDIUM: { key: 'FREEDIUM', name: 'Fremedium', url: 'https://freedium.cfd/', deprecated: true, },
        ARCHIVE: { key: 'ARCHIVE', name: 'Archive newest index', url: 'https://archive.is/newest/', deprecated: false, },
        PERISCOPE: { key: 'PERISCOPE', name: 'periscope', url: 'https://periscope.corsfix.com/?', deprecated: false, },
    });

    const getActiveServices = () => {
        return Object.values(SERVICE_REGISTRY).filter(
            service => !service.deprecated
        );
    }

    const BANNER_ID_ARTICLE = 'fudium-article-banner';
    const BANNER_ID_PAGE = 'fudium-page-banner';
    const POPUP_ID_SERVICE = 'fudium-service-popup';

    // Utility function to wait for elements
    const waitForElement = async ({ selector, timeout = 5000, multiple = false }) => {
        const queryMethod = multiple ? 'querySelectorAll' : 'querySelector';
        const existing = document[queryMethod](selector);
        if (multiple ? existing.length > 0 : existing) return existing;

        return new Promise((resolve, reject) => {
            const observer = new MutationObserver(() => {
                const element = document[queryMethod](selector);
                if (multiple ? element.length > 0 : element) {
                    observer.disconnect();
                    clearTimeout(timeoutId);
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            const timeoutId = setTimeout(() => {
                observer.disconnect();
                resolve(multiple ? [] : null);
            }, timeout);
        });
    };

    // Create banner elements
    const createBanner = ({ isPageBanner = false, onClick }) => {
        const banner = document.createElement('div');
        banner.id = isPageBanner ? BANNER_ID_PAGE : BANNER_ID_ARTICLE;

        Object.assign(banner.style, {
            position: isPageBanner ? 'fixed' : 'absolute',
            padding: '10px',
            borderRadius: '5px',
            color: 'white',
            zIndex: '498',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            ...(isPageBanner
                ? { bottom: '50vh', right: '20px' }
                : { top: '0', right: '0' }
            )
        });


        banner.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" fill="white" style="vertical-align: middle; margin-right: 5px;">
                <path d="M320 96c-35.3 0-64 28.7-64 64v64h192c35.3 0 64 28.7 64 64v224c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V288c0-35.3 28.7-64 64-64v-64c0-70.7 57.3-128 128-128 63.5 0 116.1 46.1 126.2 106.7 2.9 17.4-8.8 33.9-26.3 36.9s-33.9-8.8-36.9-26.3c-5-30.2-31.3-53.3-63-53.3m40 328c13.3 0 24-10.7 24-24s-10.7-24-24-24h-80c-13.3 0-24 10.7-24 24s10.7 24 24 24z"/>
            </svg>
            Open Free
        `;

        banner.addEventListener('click', onClick)

        return banner;
    };

    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0; // Bitwise operations constrain to a 32-bit integer
        }
        return hash;
    }

    const createPopUp = ({ id, children, closeOnOutside = true }) => {
        const popup = document.createElement('div');
        popup.id = `${POPUP_ID_SERVICE}-${id}`;

        Object.assign(popup.style, {
            position: 'absolute',
            width: '100px',
            top: '40px',
            left: '0px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            textDecoration: 'none',
            fontSize: '10px',
            fontWeight: 'bold',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
        });

        const renderChildren = (children) => {
            popup.innerHTML = '';

            children.forEach(child => {
                if (typeof child === 'function') {
                    popup.appendChild(child());
                } else if (child instanceof HTMLElement) {
                    popup.appendChild(child);
                } else {
                    throw new Error('Child must be HTMLElement or function returning HTMLElement');
                }
            });
        };

        let removeOutsideListener = null;

        const setupOutsideClick = () => {
            if (!closeOnOutside) return;

            const handler = (event) => {
                if (!popup.contains(event.target)) {
                    api.unmount();
                }
            };

            document.addEventListener('pointerdown', handler, true);

            removeOutsideListener = () => {
                document.removeEventListener('pointerdown', handler, true);
            };
        };

        renderChildren(children);

        const api = {
            element: popup,

            mount(parent = document.body) {
                parent.appendChild(popup);
                setupOutsideClick();
            },

            unmount() {
                removeOutsideListener?.();
                popup.remove();
            },

            updateChildren(newChildren) {
                renderChildren(newChildren);
            },
        };

        return api;
    };


    const createLink = ({ linkArticle, serviceUrl, serviceName }) => {
        const serviceLink = document.createElement('a');
        serviceLink.href = serviceUrl + linkArticle
        serviceLink.text = serviceName

        Object.assign(serviceLink, {
            padding: '2px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 'bold',
        })

        serviceLink.addEventListener('mouseover', () => {
            serviceLink.style.backgroundColor = 'blue';
        });

        serviceLink.addEventListener('mouseout', () => {
            serviceLink.style.backgroundColor = 'transparent';
        });

        return serviceLink
    }

    // Check if article is member-only
    const isMemberOnlyArticle = async (element) => {
        if (element) {
            return element.querySelector('button[aria-label="Member-only story"]') !== null;
        }

        // Check for page-level paywall indicators
        const paywallButton = await waitForElement({ selector: '#paywallButton-programming', timeout: 2000 });

        if (!paywallButton) {
            return false;
        }

        return [...document.querySelectorAll('div>p')]
            .some(p => p.innerText.includes('Member-only story'));
    };

    // Check if current page is an full article page
    const isFullArticlePage = () => {
        const locationPath = window.location.pathname;

        const exceptPath = ['/@MediumStaff/list'];
        if (exceptPath.some(except => locationPath.includes(except))) return false;

        const pathParts = locationPath.split('/').filter(Boolean);
        if (pathParts.length === 0) return false;

        const lastPart = pathParts[pathParts.length - 1];
        const possibleHash = lastPart.split('-').pop();

        return /^[a-f0-9]{12,}$/i.test(possibleHash);
    };

    // Check if we're on Medium
    const isMediumSite = async () => {
        try {
            const logo = await waitForElement({ selector: '#wordmark-medium-desc', timeout: 2000 });
            return logo !== null;
        } catch {
            return false;
        }
    };

    // Add banners to article cards
    const addArticleBanners = async () => {
        try {
            const articles = await waitForElement({ selector: 'article', timeout: 4000, multiple: true });

            if (!articles.length) return;

            for (const article of articles) {
                const linkElement = article.querySelector('div[role="link"]');
                if (!linkElement || linkElement.querySelector(`#${BANNER_ID_ARTICLE}`)) continue;

                if (await isMemberOnlyArticle(linkElement)) {
                    linkElement.style.position = 'relative';
                    const urlArticle = linkElement.dataset.href
                    const linkElements = getActiveServices().map((s) => {
                        return createLink({ linkArticle: urlArticle, serviceUrl: s.url, serviceName: s.name })
                    })

                    const popup = createPopUp({ id: simpleHash(urlArticle), children: linkElements })
                    const bannerOnClick = () => {
                        popup.mount(banner)
                    }
                    const banner = createBanner({ onClick: bannerOnClick })
                    linkElement.appendChild(banner);
                }
            }
        } catch (error) {
            console.error('Error adding article banners:', error);
        }
    };

    // Add banner to article page
    const addPageBanner = async () => {
        if (document.querySelector(`#${BANNER_ID_PAGE}`) || !await isMemberOnlyArticle()) {
            return;
        }

        try {
            const heading = await waitForElement({ selector: 'h1', timeout: 4000 });
            if (heading?.parentElement) {
                heading.parentElement.style.position = 'relative';
                const urlArticle = window.location.href;
                const linkElements = getActiveServices().map((s) => {
                    return createLink({ linkArticle: urlArticle, serviceUrl: s.url, serviceName: s.name })
                })

                const popup = createPopUp({ id: simpleHash(urlArticle), children: linkElements })
                const bannerOnClick = () => {
                    popup.mount(banner)
                }
                const banner = createBanner({ onClick: bannerOnClick, isPageBanner: true })
                heading.parentElement.appendChild(banner);
            }
        } catch (error) {
            console.error('Error adding page banner:', error);
        }
    };

    // Remove page banner if not on article page
    const cleanupPageBanner = () => {
        const banner = document.querySelector(`#${BANNER_ID_PAGE}`);
        if (banner) banner.remove();
    };

    // Throttled scroll handler
    let scrollTimeout;
    const handleScroll = () => {
        if (scrollTimeout) return;

        scrollTimeout = setTimeout(async () => {
            if (isFullArticlePage()) {
                await addPageBanner();
            } else {
                cleanupPageBanner();
                await addArticleBanners();
            }
            scrollTimeout = null;
        }, 150);
    };

    // Initialize the script
    const initialize = async () => {
        if (!await isMediumSite()) return;

        if (isFullArticlePage()) {
            await addPageBanner();
        } else {
            await addArticleBanners();
        }

        // Set up scroll listener with throttling
        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // Handle navigation changes (SPA)
    const handleNavigation = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        await initialize();
    };

    // Listen for navigation events
    ['popstate', 'pushstate', 'locationchange'].forEach(event => {
        window.addEventListener(event, handleNavigation);
    });

    // Start the script
    await initialize();
})();