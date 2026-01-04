// ==UserScript==
// @name         SuetaBlock
// @namespace    https://greasyfork.org/en/users/257400-z1xus
// @version      0.5b
// @description  AdBlock, but for sueta
// @author       z1xus
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://sueta.guru/*
// @grant        none
// @run-at       document-body
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/476286/SuetaBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/476286/SuetaBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const documentBody = document.body;
    const historyObj = history;

    const blockedWordsRegex = /(?:сует|sueta)(?:олог)?/giu;
    const blockedEmojiRegex = /:sueta:/giu;
    const combinedRegex = new RegExp(`(${blockedWordsRegex.source})|(${blockedEmojiRegex.source})`, 'iu');

    const filterContent = (node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches('img[alt*=":sueta:"]')) {
                const placeholder = document.createElement('span');
                placeholder.textContent = '[REDACTED]';
                if (node.parentNode) {
                    node.parentNode.replaceChild(placeholder, node);
                }
            }
            else {
                if (node.title && combinedRegex.test(node.title)) {
                    node.title = node.title.replace(combinedRegex, (match, p1, p2) => {
                        if (p1) return '[REDACTED]';
                        if (p2) return '';
                    });
                }
                node.childNodes.forEach(filterContent);
                if (combinedRegex.test(node.textContent)) {
                    node.childNodes.forEach(child => {
                        if (child.nodeType === Node.TEXT_NODE) {
                            child.textContent = child.textContent.replace(combinedRegex, (match, p1, p2) => {
                                if (p1) return '[REDACTED]';
                                if (p2) return '';
                            });
                        }
                    });
                }
            }
        }
    }

    const replaceLogo = () => {
        const logoElement = document.querySelector('html body #lzt-logo');
        const existingStyle = document.head.querySelector('style[id="og-logo-style"]');

        if (!existingStyle && logoElement) {
            const logoStyle = window.getComputedStyle(logoElement);
            const logoBackgroundImage = logoStyle.getPropertyValue('background-image');
            const currentLogoUrl = 'url("https://zelenka.guru/styles/brand/logos/sueta.gif")';

            if (logoBackgroundImage === currentLogoUrl) {
                const newStyle = document.createElement('style');
                newStyle.id = 'og-logo-style';
                newStyle.innerHTML = `
                    html body #lzt-logo {
                        background-image: url('https://i.imgur.com/4YEIqki.png') !important;
                    }
                `;
                document.head.appendChild(newStyle);
            }
        }
    };

    const cleanup = () => {
        Array.from(documentBody.querySelectorAll('*')).forEach(filterContent);
    }

    const overrideHistoryMethods = (methods) => {
        methods.forEach(methodName => {
            const originalMethod = historyObj[methodName];
            if (typeof originalMethod === 'function') {
                historyObj[methodName] = function() {
                    const result = originalMethod.apply(this, arguments);
                    window.dispatchEvent(new Event(methodName.toLowerCase()));
                    window.dispatchEvent(new Event('locationchange'));
                    return result;
                };
            }
        });
    }

    const observeMutations = () => {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'alt') {
                    filterContent(mutation.target);
                } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        filterContent(node);
                        if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'IMG') {
                            Array.from(node.querySelectorAll('*')).forEach(filterContent);
                        }
                    });
                }
            });
        });

        observer.observe(documentBody, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['alt'] });
    }

    overrideHistoryMethods(['pushState', 'replaceState']);

    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('locationchange', cleanup);

    if (window.location.href.includes('https://sueta.guru/')) {
        document.body.innerHTML = '<h1 style="text-align: center; color: white; margin-top: 50vh; transform: translateY(-50%);">This domain is blocked</h1>';
    } else {
        cleanup();
        observeMutations();
        replaceLogo();
    }
})();
