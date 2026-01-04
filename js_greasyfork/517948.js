// ==UserScript==
// @name         Superhivemarket Downloader
// @description  Added a download button via CGDownload, GFXFather, and GFXCamp.
// @icon         https://assets.superhivemarket.com/site_assets/images/black_bee.png
// @version      1.7
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://superhivemarket.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/517948/Superhivemarket%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/517948/Superhivemarket%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    let buttonCheckInterval;
    let retryCount = 0;
    const MAX_RETRIES = 10;
    const RETRY_DELAY = 500;

    const ICONS = {
        cgdownload: 'https://raw.githubusercontent.com/afkarxyz/userscripts/refs/heads/main/assets/superhivemarket/cgdownload.png',
        gfxfather: 'https://raw.githubusercontent.com/afkarxyz/userscripts/refs/heads/main/assets/superhivemarket/gfxfather.png',
        gfxcamp: 'https://raw.githubusercontent.com/afkarxyz/userscripts/refs/heads/main/assets/superhivemarket/gfxcamp.png'
    };

    function addStyles() {
        const styles = `
            .download-btn {
                background: linear-gradient(120deg, #6800f0, #ff6b00);
                color: white;
                border: none;
                padding: 4px;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
            }
            
            .download-btn:hover {
                background: linear-gradient(120deg, #5600c7, #e65d00);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    function getProductNameFromURL() {
        const currentURL = window.location.href;
        const match = currentURL.match(/products\/([^/?]+)/);
        return match ? match[1] : '';
    }

    function createCGDownloadURL(productName) {
        return `https://cgdownload.ru/?s=${encodeURIComponent(productName.replace(/-/g, ' '))}`;
    }

    function createGFXFatherURL(productName) {
        return `https://gfxfather.com/?s=${encodeURIComponent(productName.replace(/-/g, ' '))}`;
    }

    function createGFXCampURL(productName) {
        return `https://www.gfxcamp.com/${productName}/`;
    }

    function clearExistingButtons() {
        const existingButtons = document.querySelectorAll('.download-btn, .cgdownload-button, .gfxfather-button, .gfxcamp-button');
        existingButtons.forEach(button => button.remove());
    }

    function createButton(className, text, urlCreator, iconUrl) {
        const originalButton = document.querySelector('.button_to input[type="submit"]');
        if (!originalButton) return null;

        const button = document.createElement('button');
        button.className = originalButton.className;
        button.classList.add(className);
        
        if (originalButton.style.cssText) {
            button.style.cssText = originalButton.style.cssText;
        }

        const contentWrapper = document.createElement('div');
        contentWrapper.style.display = 'flex';
        contentWrapper.style.alignItems = 'center';
        contentWrapper.style.justifyContent = 'center';
        contentWrapper.style.gap = '8px';

        const icon = document.createElement('img');
        icon.src = iconUrl;
        icon.alt = text;
        icon.style.width = '20px';
        icon.style.height = '20px';
        icon.style.objectFit = 'contain';

        const textSpan = document.createElement('span');
        textSpan.textContent = text;

        contentWrapper.appendChild(icon);
        contentWrapper.appendChild(textSpan);
        button.appendChild(contentWrapper);

        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = getProductNameFromURL();
            if (productName) {
                const downloadURL = urlCreator(productName);
                window.open(downloadURL, '_blank');
            }
        });

        return button;
    }

    function addProductPageButtons() {
        if (!window.location.href.includes('/products/')) {
            return;
        }

        clearExistingButtons();

        const originalForm = document.querySelector('.button_to');
        if (!originalForm) {
            return;
        }

        if (document.querySelector('.cgdownload-button') && document.querySelector('.gfxfather-button') && document.querySelector('.gfxcamp-button')) {
            return;
        }

        const priceElement = document.querySelector('.js-price-cart');
        if (priceElement) {
            priceElement.classList.remove('d-none', 'd-md-block');
            priceElement.classList.add('text-center');
            priceElement.style.marginBottom = '1rem';
            priceElement.style.display = 'block';
            priceElement.style.width = '100%';
            originalForm.parentNode.insertBefore(priceElement, originalForm);
        }

        const cgDownloadButton = createButton(
            'cgdownload-button',
            'CGDownload',
            createCGDownloadURL,
            ICONS.cgdownload
        );

        const gfxFatherButton = createButton(
            'gfxfather-button',
            'GFXFather',
            createGFXFatherURL,
            ICONS.gfxfather
        );

        const gfxCampButton = createButton(
            'gfxcamp-button',
            'GFXCamp',
            createGFXCampURL,
            ICONS.gfxcamp
        );

        if (cgDownloadButton && gfxFatherButton && gfxCampButton) {
            const wrapper = document.createElement('div');
            wrapper.style.marginTop = '0.5rem';
            wrapper.appendChild(cgDownloadButton);
            
            const wrapper2 = document.createElement('div');
            wrapper2.style.marginTop = '0.5rem';
            wrapper2.appendChild(gfxFatherButton);

            const wrapper3 = document.createElement('div');
            wrapper3.style.marginTop = '0.5rem';
            wrapper3.appendChild(gfxCampButton);

            originalForm.insertAdjacentElement('afterend', wrapper3);
            originalForm.insertAdjacentElement('afterend', wrapper2);
            originalForm.insertAdjacentElement('afterend', wrapper);
        }
    }

    function addAllButtons() {
        addStyles();
        addProductPageButtons();
    }

    function startButtonCheck() {
        if (buttonCheckInterval) {
            clearInterval(buttonCheckInterval);
        }

        retryCount = 0;
        buttonCheckInterval = setInterval(() => {
            if (addAllButtons() || retryCount >= MAX_RETRIES) {
                clearInterval(buttonCheckInterval);
                buttonCheckInterval = null;
                retryCount = 0;
            } else {
                retryCount++;
            }
        }, RETRY_DELAY);
    }

    function startObserver() {
        if (observer) {
            observer.disconnect();
        }

        startButtonCheck();

        observer = new MutationObserver((mutations) => {
            const hasRelevantChanges = mutations.some(mutation => {
                const addedNodes = Array.from(mutation.addedNodes);
                return addedNodes.some(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        return node.querySelector('.button_to') || 
                               node.classList.contains('button_to') ||
                               node.closest('.button_to');
                    }
                    return false;
                });
            });

            if (hasRelevantChanges) {
                startButtonCheck();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style'],
            characterData: false
        });
    }

    function setupHistoryListener() {
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            setTimeout(startObserver, 100);
        };

        const replaceState = history.replaceState;
        history.replaceState = function() {
            replaceState.apply(history, arguments);
            setTimeout(startObserver, 100);
        };

        window.addEventListener('popstate', () => setTimeout(startObserver, 100));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setupHistoryListener();
            startObserver();
        });
    } else {
        setupHistoryListener();
        startObserver();
    }
})();