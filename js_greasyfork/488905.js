// ==UserScript==
// @name         slash search bar focus
// @namespace    guebosch
// @version      2025-03-06
// @description  Focus search bar on pressing SLASH (/) or BACKSLASH (\) on amazon.de, bing.com, userscript.zone, github, aliexpress, hornbach, readly, greasyfork, ebay, temu
// @author       guebosch
// @match        https://www.bing.com/search*
// @match        https://www.userscript.zone/search*
// @match        https://github.com/*
// @match        https://go.readly.com/*
// @match        https://greasyfork.org/en/scripts*
// @match        https://www.hornbach.at/*
// @match        https://*.aliexpress.com/*
// @match        https://*.temu.com/*
// @match        https://www.amazon.de/*
// @match        https://www.google.com/search?q=*
// @match        https://www.google.com/search?newwindow=*
// @match        https://www.ebay.at/sch/*
// @match        https://www.ebay.de/sch/*
// @match        https://www.reddit.com/*
// @match        https://www.ebay.com/sch/*
// @match        https://piratehaven.xyz/search.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488905/slash%20search%20bar%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/488905/slash%20search%20bar%20focus.meta.js
// ==/UserScript==

//debugger;

// Note: google seems to work out of the box. somethimes. Not always on the News Page.

(function() {
    const hostname = window.location.hostname;
    var searchField;
    window.addEventListener("keypress", e => {
        if (['TEXTAREA', 'INPUT'].includes(e.target.nodeName)) return;
        if (e.key !== "/" && e.key !== "\\") return;

        if (['www.bing.com', 'www.hornbach.at'].includes(hostname)) {
            searchField = document.querySelector('textarea[type="search"], input[type="search"], input[name="search"], input[placeholder*="Search"]');
        }
        else if (['www.userscript.zone','piratehaven.xyz'].includes(hostname)) {
            searchField = document.querySelector('#search');
        }
        else if (['github.com'].includes(hostname)) {
            searchField = document.querySelector('#js-issues-search');
        }
        else if (['de.aliexpress.com','en.aliexpress.com','www.aliexpress.com'].includes(hostname)) {
            searchField = document.querySelector('#search-words');
        }
        else if (['www.amazon.de'].includes(hostname)) {
            searchField = document.querySelector('#twotabsearchtextbox');
        }
        else if (['go.readly.com'].includes(hostname)) {
            searchField = document.querySelector('#content-gate-input');
        }
        else if (['greasyfork.org'].includes(hostname)) {
            searchField = document.querySelector('input[type="search"][name="q"]');
        }
        else if (['reddit.com'].includes(hostname)) {
            searchField = document.querySelector('input[type="text"][name="q"]');
        }
        else if (['www.ebay.at','www.ebay.de','www.ebay.com'].includes(hostname)) {
            searchField = document.querySelector('#gh-ac');
        }
        else if (['www.google.com'].includes(hostname)) {
            searchField = document.querySelector('#textarea[name="q"], textarea[id="q"]');
        }
        else if (['www.temu.com'].includes(hostname)) {
            searchField = document.querySelector('input[id="searchInput"]');
        }
        if (!searchField) return;
        window.scrollTo(0, 0);  // Scroll to the top
        searchField.focus();
        // move cursor to the right
        searchField.setSelectionRange(searchField.value.length, searchField.value.length);
        e.preventDefault();
    });
})();