// ==UserScript==
// @name         clean-search-extension
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Auto-clean popular search engine URLs for a faster, cleaner experience. | made by conflicted
// @author       conflicted @kittenware on discord
// @match        *://www.google.com/search*
// @match        *://www.google.*.*/search*
// @match        *://search.yahoo.com/search*
// @match        *://*.search.yahoo.com/search*
// @match        *://www.bing.com/search*
// @match        *://duckduckgo.com/*
// @match        *://yandex.com/search/*
// @match        *://yandex.ru/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534298/clean-search-extension.user.js
// @updateURL https://update.greasyfork.org/scripts/534298/clean-search-extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);

    let cleaned = false; // Flag to detect if cleaning happened

    // GOOGLE
    if (url.hostname.includes('google.')) {
        if (url.searchParams.get('udm') !== '14') {
            url.searchParams.set('udm', '14');
            window.location.replace(url.toString());
        }
    }

    // YAHOO
    else if (url.hostname.includes('yahoo.com')) {
        const p = url.searchParams.get('p');
        if (p) {
            const cleanUrl = `${url.origin}${url.pathname}?p=${encodeURIComponent(p)}`;
            if (window.location.href !== cleanUrl) {
                window.location.replace(cleanUrl);
            }
        }
    }

    // BING
    else if (url.hostname.includes('bing.com')) {
        const q = url.searchParams.get('q');
        if (q) {
            const cleanUrl = `${url.origin}${url.pathname}?q=${encodeURIComponent(q)}`;
            if (window.location.href !== cleanUrl) {
                window.location.replace(cleanUrl);
            }
        }
    }

    // DUCKDUCKGO
    else if (url.hostname.includes('duckduckgo.com')) {
        const q = url.searchParams.get('q');
        if (q) {
            const cleanUrl = `${url.origin}${url.pathname}?q=${encodeURIComponent(q)}`;
            if (window.location.href !== cleanUrl) {
                window.location.replace(cleanUrl);
            }
        }
    }

    // YANDEX
    else if (url.hostname.includes('yandex.com') || url.hostname.includes('yandex.ru')) {
        const text = url.searchParams.get('text');
        if (text) {
            const cleanUrl = `${url.origin}${url.pathname}?text=${encodeURIComponent(text)}`;
            if (window.location.href !== cleanUrl) {
                window.location.replace(cleanUrl);
            }
        }
    }

    // AFTER THE PAGE LOADS
    window.addEventListener('load', () => {
        showPopup();
    });

    // Little Popup
    function showPopup() {
        const popup = document.createElement('div');
        popup.innerText = 'Results Cleaned by Conflicted @kittenware';
        popup.style.position = 'fixed';
        popup.style.top = '20px';
        popup.style.right = '20px';
        popup.style.backgroundColor = '#222';
        popup.style.color = '#fff';
        popup.style.padding = '10px 15px';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
        popup.style.zIndex = '99999';
        popup.style.fontFamily = 'Arial, sans-serif';
        popup.style.fontSize = '14px';
        popup.style.opacity = '0.9';
        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 2000); // Remove popup after 2 seconds
    }
})();
