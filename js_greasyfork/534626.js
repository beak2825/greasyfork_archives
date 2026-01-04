// ==UserScript==
// @name         Reddit Login Autofill helper
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Show proxy form only when Reddit's login dialog is visible
// @author       bedweb
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @match        https://m.reddit.com/*
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/534626/Reddit%20Login%20Autofill%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/534626/Reddit%20Login%20Autofill%20helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function log(...args) {
        console.log('[Reddit-Proxy-Autofill]', ...args);
    }

    let proxyForm;

    function createProxyForm() {
        if (proxyForm) return proxyForm;

        proxyForm = document.createElement('form');
        proxyForm.id = 'raf-proxy-form';
        proxyForm.style.position = 'fixed';
        proxyForm.style.top = '1rem';
        proxyForm.style.left = '1rem';
        proxyForm.style.zIndex = '99999';
        proxyForm.style.background = 'rgba(255,255,255,0.95)';
        proxyForm.style.padding = '0.5rem';
        proxyForm.style.borderRadius = '0.5rem';
        proxyForm.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        proxyForm.innerHTML = `
      <input type="text" name="username" autocomplete="username"><br>
      <input type="password" name="password" autocomplete="current-password"><br>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
        <button type="button" id="raf-close-btn" style="font-size:0.8rem;">close</button>
        <button type="button" id="raf-allowfocus-btn" style="font-size:0.8rem;">allowfocus</button>
        <button type="submit">inject to form</button>
      </div>

    `;
        proxyForm.addEventListener('submit', e => {
            e.preventDefault();
            transferCredentials(proxyForm.username.value, proxyForm.password.value);
        });
        proxyForm.querySelector('#raf-close-btn').addEventListener('click', () => {
            hideProxyForm();
        });
        proxyForm.querySelector('#raf-allowfocus-btn').addEventListener('click', () => {
            allowfocus();
        });

        return proxyForm;
    }

    function showProxyForm() {
        if (!document.body.contains(proxyForm)) {
            document.body.appendChild(proxyForm);
            log('Proxy form shown.');
        }
    }

    function hideProxyForm() {
        if (proxyForm && document.body.contains(proxyForm)) {
            proxyForm.remove();
            log('Proxy form hidden.');
        }
    }
    function allowfocus() {
        const tohide = DomUtils.traverseShadow(document, `div.justify-between.items-end`);
        tohide.style.display = "none";
    }

    function transferCredentials(username, password) {
        if (!username || !password) {
            alert('Please fill in both username and password.');
            return;
        }

        let injected = false;

        const transferField = (dummy, name) => {
            const real = DomUtils.traverseShadow(document, `input[name="${name}"]`);
            if (real && dummy) {
                real.value = dummy;
                real.dispatchEvent(new Event('input', { bubbles: true }));
                real.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
        };

        injected = transferField(username, 'username') && transferField(password, 'password');

        if (!injected) {
            alert('Could not inject credentials automatically. Please paste them manually.');
        }
    }

    function observeLoginModal() {
        const observer = new MutationObserver(() => {
            const modal = document.querySelector('auth-flow-modal');
            if (modal && modal.offsetParent !== null) {
                showProxyForm();
            } else {
                hideProxyForm();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
    /* Shared Utilities */
    const DomUtils = {
        waitForElement: (selector) => new Promise(resolve => {
            if (document.querySelector(selector)) return resolve();
            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }),

        traverseShadow: (root = document, selector) => {
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: node => node.shadowRoot ?
                        NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
                }
            );

            while (walker.nextNode()) {
                const shadowRoot = walker.currentNode.shadowRoot;
                const element = shadowRoot.querySelector(selector);
                if (element) return element;
                const nested = DomUtils.traverseShadow(shadowRoot, selector);
                if (nested) return nested;
            }
            return null;
        }
    };

    proxyForm = createProxyForm();
    observeLoginModal();
})();
