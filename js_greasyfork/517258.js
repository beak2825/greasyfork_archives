// ==UserScript==
// @name         OplaCRM - Open In Current Tab
// @namespace    http://tampermonkey.net/
// @version      20241224
// @description  The user will no longer experience links opening in a new tab. Instead, they will navigate within the current tab.
// @author       You
// @match        https://app-staging.opla-crm.com/*
// @match        http://localhost:6060/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=opla-crm.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517258/OplaCRM%20-%20Open%20In%20Current%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/517258/OplaCRM%20-%20Open%20In%20Current%20Tab.meta.js
// ==/UserScript==

(function() {
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function openInCurrentTab() {
        const links = document.querySelectorAll('a[target="_blank"]');
        links.forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                console.log(`Opening link: ${link.getAttribute('href')}`);
                let _href = '/' + link.getAttribute('href');
                _href = _href.replace('//', '/');
                debouncedRedirect(_href);
            });
        });
    }

    const debouncedRedirect = debounce((href) => {
        window._$g?.rdr?.(href);
    }, 300); // Adjust debounce delay as needed (300ms here)

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                openInCurrentTab();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
