// ==UserScript==
// @name         Search Box Keyboard Shortcut for General Websites
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Adds a keyboard shortcut to jump to the search box on websites when '/' is pressed
// @author       Lak
// @match        https://www.google.com/*
// @match        https://studio.youtube.com/*
// @match        https://www.jstor.org/*
// @match        https://www.urbandictionary.com/*
// @match        https://books.google.com/*
// @match        https://archive.org/*
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @match        https://support.google.com/*
// @match        https://onlinelibrary-wiley-com.proxy.library.upenn.edu/*
// @match        https://wiki.pmacs.upenn.edu/*
// @match        https://store.steampowered.com/*
// @match        https://www.workday.upenn.edu/*
// @match        https://myaccount.google.com/*
// @match        https://*.stackexchange.com/*
// @match        https://www.amazon.com/*
// @match        https://www.tampermonkey.net/*
// @match        https://chat.openai.com/*
// @match        https://www.w3schools.com/*
// @match        https://www.overleaf.com/*
// @match        https://onlinelibrary.wiley.com/*
// @match        https://www.wolframalpha.com/*
// @match        https://www.netflix.com/*
// @match        https://libgen.is/*
// @match        https://arxiv.org/*
// @match        https://fmoviesz.to/*
// @match        https://www.biorxiv.org/*
// @match        https://www.userscript.zone/*
// @match        https://gist.github.com/*
// @match        https://docs.github.com/*
// @match        https://www.bing.com/*
// @match        https://poe.com/*
// @match        https://www.kaggle.com/*
// @match        https://www.myworkday.com/*
// @match        https://duckduckgo.com/*
// @match        https://rumble.com/*
// @match        https://kick.com/*
// @match        https://greasyfork.org/*
// @match        https://openuserjs.org/*
// @match        https://banned.video/*
// @match        https://canvas.upenn.edu/*
// @match        https://huggingface.co/*
// @match        https://www.banned.video/*
// @match        https://developer.chrome.com/*
// @match        https://stackoverflow.com/*
// @exclude      https://www.google.com/finance/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491920/Search%20Box%20Keyboard%20Shortcut%20for%20General%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/491920/Search%20Box%20Keyboard%20Shortcut%20for%20General%20Websites.meta.js
// ==/UserScript==



(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // target the specific elements for the search boxes on websites
        const searchBox = document.querySelector('.searchboxinput, textarea[aria-label="Search"], input[id="query-input"], input[type="text"],  input[id="searchform"], input[type="Search"], textarea[inputmode="search"], .js-search-input.search__input--adv, .header-search-field, input[enterkeyhint="go"], input[aria-label="Search"], input[aria-label="Search for stocks, ETFs & more"]');


        if (e.key === '/' && searchBox && document.activeElement !== searchBox) {
            e.preventDefault();
            searchBox.focus();
            searchBox.setSelectionRange(searchBox.value.length, searchBox.value.length);
        }
    });
})();
