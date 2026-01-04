// ==UserScript==
// @name         Blizzard Forums Tweaks
// @namespace    https://greasyfork.org/users/877912
// @version      0.1
// @description  Combined tweaks for Blizzard forums: remove main outlet padding, hide pinned topics, enable clickable links (even broken ones), hide more topics, hide signup card and hide footer — with per-feature toggles.
// @author       NWP
// @license      MIT
// @match        https://*.forums.blizzard.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543356/Blizzard%20Forums%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/543356/Blizzard%20Forums%20Tweaks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const logError = (label, err) => {
        console.error(`[Blizzard Forums Tweaks] Error in ${label}:`, err);
    };

    const features = [
        {
            key: 'removePadding',
            label: 'Remove Main Outlet Padding',
            default: true,
            apply: () => {
                try {
                    const main = document.getElementById('main-outlet');
                    if (main) main.style.paddingTop = '0';
                } catch (err) {
                    logError('removePadding.apply', err);
                }
            },
            initObserver: () => {
                try {
                    const fn = () => features.find(f => f.key === 'removePadding').apply();
                    fn();
                    new MutationObserver(fn)
                        .observe(document.body, { childList: true, subtree: true });
                } catch (err) {
                    logError('removePadding.initObserver', err);
                }
            }
        },
        {
            key: 'hidePinned',
            label: 'Hide Pinned Topics',
            default: true,
            apply: () => {
                try {
                    document.querySelectorAll('tr.topic-list-item.pinned')
                        .forEach(el => el.style.display = 'none');
                } catch (err) {
                    logError('hidePinned.apply', err);
                }
            },
            initObserver: () => {
                try {
                    const fn = () => features.find(f => f.key === 'hidePinned').apply();
                    fn();
                    new MutationObserver(fn)
                        .observe(document.body, { childList: true, subtree: true });
                } catch (err) {
                    logError('hidePinned.initObserver', err);
                }
            }
        },
        {
            key: 'clickableLinks',
            label: 'Clickable Links',
            default: true,
            apply: () => {
                try {
                    if (!document.getElementById('gm-clickable-links-style')) {
                        const style = document.createElement('style');
                        style.id = 'gm-clickable-links-style';
                        style.textContent = `
                            code a.generated-link,
                            a.generated-link, a.generated-link:visited {
                                color: lightgreen !important;
                                text-decoration: underline;
                                background-color: transparent !important;
                                font-size: 1.25em !important;
                            }
                            a.generated-link.visited-manual {
                                color: orange !important;
                            }
                            .cooked a:not(.generated-link) {
                                color: lightgreen !important;
                                text-decoration: underline;
                            }
                            .cooked a:not(.generated-link).visited-manual {
                                color: orange !important;
                            }
                            code {
                                background-color: transparent !important;
                                border: none !important;
                                box-shadow: none !important;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                } catch (err) {
                    logError('clickableLinks.apply', err);
                }
            },
            initObserver: () => {
                try {
                    const feat = features.find(f => f.key === 'clickableLinks');
                    feat.apply();

                    const urlRegex = /\b((?:https?:\/\/|ftp:\/\/|www\.|htps:\/\/)[a-z0-9\-]+(?:\.[a-z0-9\-]+)+(?:\/[^\s<>"'`()\[\]]*[^.,:;"'\s<>()\[\]])?)/gi;

                    const isInsideLink = node => {
                        while (node) {
                            if (node.nodeName === 'A') return true;
                            node = node.parentNode;
                        }
                        return false;
                    };

                    const markAsVisited = link => link.classList.add('visited-manual');

                    const attachClickTracking = link => {
                        link.addEventListener('click', e => {
                            if (e.button === 0 || e.button === 1) markAsVisited(link);
                        });
                        link.addEventListener('auxclick', e => {
                            if (e.button === 1) markAsVisited(link);
                        });
                    };

                    const convertTextNode = node => {
                        if (node.nodeType !== Node.TEXT_NODE || isInsideLink(node)) return;

                        const cleanedText = node.textContent.replace(/\bhtps:\/\//gi, 'https://');
                        if (!cleanedText.match(urlRegex)) return;

                        const parent = node.parentNode;
                        const fragment = document.createDocumentFragment();
                        let lastIndex = 0;

                        [...cleanedText.matchAll(urlRegex)].forEach(match => {
                            const url = match[0];
                            const index = match.index;

                            fragment.appendChild(document.createTextNode(cleanedText.slice(lastIndex, index)));

                            const a = document.createElement('a');
                            a.href = url.match(/^https?:\/\//i) || url.match(/^ftp:\/\//i) ? url : 'https://' + url;
                            a.textContent = url;
                            a.target = '_blank';
                            a.rel = 'noopener noreferrer';
                            a.className = 'generated-link';
                            attachClickTracking(a);
                            fragment.appendChild(a);

                            lastIndex = index + url.length;
                        });

                        fragment.appendChild(document.createTextNode(cleanedText.slice(lastIndex)));
                        parent.replaceChild(fragment, node);
                    };

                    const processCooked = (root = document.body) => {
                        root.querySelectorAll('.cooked, .cooked *').forEach(el => {
                            Array.from(el.childNodes).forEach(convertTextNode);
                        });
                    };

                    const scanCodeBlocks = (root = document.body) => {
                        root.querySelectorAll('code').forEach(el => {
                            Array.from(el.childNodes).forEach(convertTextNode);
                        });
                    };

                    const enhanceExistingLinks = (root = document.body) => {
                        root.querySelectorAll('.cooked a:not(.generated-link)').forEach(link => {
                            if (!link.hasAttribute('data-click-tracked')) {
                                attachClickTracking(link);
                                link.setAttribute('data-click-tracked', 'true');
                            }
                        });
                    };

                    scanCodeBlocks();
                    processCooked();
                    enhanceExistingLinks();

                    new MutationObserver(mutations => {
                        for (const m of mutations) {
                            for (const node of m.addedNodes) {
                                if (node.nodeType === Node.ELEMENT_NODE) {
                                    scanCodeBlocks(node);
                                    processCooked(node);
                                    enhanceExistingLinks(node);
                                }
                            }
                        }
                    }).observe(document.body, { childList: true, subtree: true });
                } catch (err) {
                    logError('clickableLinks.initObserver', err);
                }
            }
        },
        {
            key: 'hideSignupCard',
            label: 'Hide Signup Card',
            default: true,
            apply: () => {
                try {
                    const card = document.querySelector('.signup-cta.alert.alert-info');
                    if (card) {
                        const parent = card.closest('.ember-view');
                        if (parent) parent.style.display = 'none';
                    }
                } catch (err) {
                    logError('hideSignupCard.apply', err);
                }
            },
            initObserver: () => {
                try {
                    const fn = () => features.find(f => f.key === 'hideSignupCard').apply();
                    fn();
                    new MutationObserver(fn)
                        .observe(document.body, { childList: true, subtree: true });
                } catch (err) {
                    logError('hideSignupCard.initObserver', err);
                }
            }
        },
        {
            key: 'hideMoreTopics',
            label: 'Hide More Topics Section',
            default: true,
            apply: () => {
                try {
                    const m = document.querySelector('.more-topics__container');
                    if (m) m.style.display = 'none';
                } catch (err) {
                    logError('hideMoreTopics.apply', err);
                }
            },
            initObserver: () => {
                try {
                    const fn = () => features.find(f => f.key === 'hideMoreTopics').apply();
                    fn();
                    new MutationObserver(fn)
                        .observe(document.body, { childList: true, subtree: true });
                } catch (err) {
                    logError('hideMoreTopics.initObserver', err);
                }
            }
        },
        {
            key: 'hideFooter',
            label: 'Hide Footer',
            default: true,
            apply: () => {
                try {
                    const f = document.querySelector('div[id^="ember"].custom-footer-content');
                    if (f) f.style.display = 'none';
                } catch (err) {
                    logError('hideFooter.apply', err);
                }
            },
            initObserver: () => {
                try {
                    const fn = () => features.find(f => f.key === 'hideFooter').apply();
                    fn();
                    new MutationObserver(fn)
                        .observe(document.body, { childList: true, subtree: true });
                } catch (err) {
                    logError('hideFooter.initObserver', err);
                }
            }
        }
    ];

    const orderedKeys = [
        'removePadding',
        'hidePinned',
        'clickableLinks',
        'hideSignupCard',
        'hideMoreTopics',
        'hideFooter'
    ];

    for (const key of orderedKeys) {
        try {
            const feat = features.find(f => f.key === key);
            const enabled = GM_getValue(feat.key, feat.default);

            GM_registerMenuCommand(
                `${enabled ? 'Disable' : 'Enable'} ${feat.label}`,
                () => {
                    GM_setValue(feat.key, !enabled);
                    location.reload();
                }
            );

            if (enabled && feat.initObserver) {
                feat.initObserver();
            }
        } catch (err) {
            logError(`main init for ${key}`, err);
        }
    }
})();