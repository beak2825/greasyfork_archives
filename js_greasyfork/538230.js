// ==UserScript==
// @name         Tumblr Old Logo: 2015
// @namespace    https://greasyfork.org/en/scripts/538230-tumblr-old-logo-2015
// @version      1.4
// @description  Replaces the current Tumblr logo with an older one from 2015.
// @author       Valerie moon
// @match        https://www.tumblr.com/*
// @icon         https://web.archive.org/web/20140723164326im_/http://assets.tumblr.com/images/favicons/favicon.ico?_v=0
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538230/Tumblr%20Old%20Logo%3A%202015.user.js
// @updateURL https://update.greasyfork.org/scripts/538230/Tumblr%20Old%20Logo%3A%202015.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const oldLogoUrl = "https://web.archive.org/web/20150214122158im_/https://secure.assets.tumblr.com/images/logo/logo_small.png?v=7148d4cebdca57896e8bfaf58012c7b9";
    const oldLogoMarkerAttr = "data-old-logo-applied-v14";
    const userscriptImageAttr = "data-userscript-old-logo-img";
    const hiddenByScriptAttr = "data-hidden-by-logo-script";

    const newLogoSelectors = [
        "nav.NkkDk > ul.gM9qK > li.Gav7q > a[aria-label='Home']",
        "nav a[aria-label='Home']",
        "header nav h1 a[aria-label='Tumblr']",
        "a[aria-label='Tumblr']"
    ];

    const newLogoHeight = "20px";
    const newLogoWidth = "97px";

    function replaceLogo() {
        if (!document.body) {
            setTimeout(replaceLogo, 100);
            return;
        }

        let logoContainerLink = null;

        for (const selector of newLogoSelectors) {
            const potentialLink = document.querySelector(selector);
            if (potentialLink && potentialLink.tagName === 'A' && (potentialLink.querySelector('svg') || potentialLink.innerHTML.includes('<svg') || selector.includes('[aria-label'))) {
                logoContainerLink = potentialLink;
                break;
            }
        }

        if (logoContainerLink) {
            const alreadyProcessed = logoContainerLink.hasAttribute(oldLogoMarkerAttr);
            let existingUserImg = logoContainerLink.querySelector(`img[${userscriptImageAttr}]`);

            if (alreadyProcessed && existingUserImg) {
                if (existingUserImg.style.height !== newLogoHeight || existingUserImg.style.width !== newLogoWidth) {
                    existingUserImg.style.height = newLogoHeight;
                    existingUserImg.style.width = newLogoWidth;
                }

                logoContainerLink.style.width = newLogoWidth;
                logoContainerLink.style.height = newLogoHeight;
                logoContainerLink.style.display = "inline-block";

                logoContainerLink.querySelectorAll(`svg[${hiddenByScriptAttr}], div[${hiddenByScriptAttr}]`).forEach(el => {
                    if (el.style.display !== 'none') el.style.display = 'none';
                });
                return;
            }

            if (existingUserImg) existingUserImg.remove();
            logoContainerLink.querySelectorAll(`[${hiddenByScriptAttr}]`).forEach(el => {
                el.style.display = '';
                el.removeAttribute(hiddenByScriptAttr);
            });
            logoContainerLink.removeAttribute(oldLogoMarkerAttr);

            const svgElement = logoContainerLink.querySelector("svg");
            if (svgElement) {
                const svgParentDiv = svgElement.parentElement;
                if (svgParentDiv && svgParentDiv !== logoContainerLink && svgParentDiv.classList.contains('FQkf4')) {
                    svgParentDiv.style.display = "none";
                    svgParentDiv.setAttribute(hiddenByScriptAttr, "true");
                } else {
                    svgElement.style.display = "none";
                    svgElement.setAttribute(hiddenByScriptAttr, "true");
                }
            }

            const img = document.createElement('img');
            img.src = oldLogoUrl;
            img.alt = "Tumblr";
            img.setAttribute(userscriptImageAttr, "true");
            img.style.height = newLogoHeight;
            img.style.width = newLogoWidth;
            img.style.display = "block";

            logoContainerLink.style.display = "inline-block";
            logoContainerLink.style.width = newLogoWidth;
            logoContainerLink.style.height = newLogoHeight;
            logoContainerLink.style.lineHeight = newLogoHeight;
            logoContainerLink.style.padding = "0";
            logoContainerLink.style.margin = "0";

            Array.from(logoContainerLink.childNodes).forEach(child => {
                if (child.nodeType === Node.TEXT_NODE && child.textContent.trim() !== '') {
                    child.remove();
                }
            });

            logoContainerLink.appendChild(img);
            logoContainerLink.setAttribute(oldLogoMarkerAttr, "true");
        }
    }

    if (document.body) {
        replaceLogo();
    } else {
        const initialBodyObserver = new MutationObserver((mutations, obs) => {
            if (document.body) {
                obs.disconnect();
                replaceLogo();
                startMainObserver();
            }
        });
        initialBodyObserver.observe(document.documentElement, { childList: true });
    }

    let mainObserver = null;
    function startMainObserver() {
        if (!document.body) return;
        if (mainObserver) mainObserver.disconnect();

        mainObserver = new MutationObserver((mutationsList) => {
            let potentialLogoChange = false;
            for (const mutation of mutationsList) {
                const targetElement = mutation.target;
                if (targetElement.nodeType === Node.ELEMENT_NODE) {
                     for (const selector of newLogoSelectors) {
                        if (targetElement.matches(selector) || targetElement.querySelector(selector) || (targetElement.parentElement && targetElement.parentElement.matches(selector))) {
                            potentialLogoChange = true;
                            break;
                        }
                    }
                    if (targetElement.hasAttribute && (targetElement.hasAttribute(oldLogoMarkerAttr) || targetElement.querySelector(`[${oldLogoMarkerAttr}]`))) {
                        potentialLogoChange = true;
                    }
                }
                 if (potentialLogoChange) break;
            }

            if (potentialLogoChange) {
                setTimeout(replaceLogo, 50);
            } else if (!document.querySelector(`img[${userscriptImageAttr}]`)) {
                setTimeout(replaceLogo, 250);
            }
        });

        mainObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }

    if (document.body) {
        startMainObserver();
    }

    function handleNavigation() {
        setTimeout(replaceLogo, 300);
        setTimeout(startMainObserver, 350);
    }

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('hashchange', handleNavigation);

    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        const result = originalPushState.apply(this, args);
        handleNavigation();
        return result;
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        const result = originalReplaceState.apply(this, args);
        handleNavigation();
        return result;
    };
})();