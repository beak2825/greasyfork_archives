// ==UserScript==
// @name         Sorry, Google!
// @namespace    https://github.com/appel/userscripts
// @version      0.4.1
// @description  Take your search elsewhere on the "/sorry" captcha pages Google serves when you use a VPN. Hold CTRL while clicking to open in a new tab.
// @author       Ap
// @match        *://www.google.com/sorry/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491248/Sorry%2C%20Google%21.user.js
// @updateURL https://update.greasyfork.org/scripts/491248/Sorry%2C%20Google%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const extractQuery = (url) => {
        const match = url.match(/q%3D(.*?)%26|q%3D(.*?)(?=&|$)/);
        if (match) {
            const queryComponent = match[1] || match[2];
            return decodeURIComponent(queryComponent.replace(/\+/g, ' '));
        }
        return '';
    };

    const searchButton = (query, baseUrl, text) => {
        const url = `${baseUrl}${query}`;
        const link = document.createElement('a');
        link.href = url;
        link.target = '_parent';
        link.title = `Take this search to ${text}`;
        link.textContent = text;
        link.style = `display: inline-block; margin-top: 2rem; margin-right: .5rem; padding: 0.35rem .75rem;
                      background-color: #302e2d; color: #ffffff; border-radius: 5px;
                      text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir,
                      segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif;
                      font-size: 17px;`;

        // Hold ctrl while clicking to open in a new tab
        link.addEventListener('click', (event) => {
            if (event.ctrlKey) {
                link.target = '_blank'; // Opens in a new tab
            } else {
                link.target = '_parent'; // Opens in the same tab or window
            }
        });

        document.body.appendChild(link);
    };

    if (window.location.href.startsWith('https://www.google.com/sorry')) {
        const query = extractQuery(window.location.href);
        searchButton(query, 'https://duckduckgo.com?q=', 'DuckDuckGo');
        searchButton(query, 'https://bing.com?q=', 'Bing');
        searchButton(query, 'https://search.brave.com/search?q=', 'Brave');
        searchButton(query, 'https://www.startpage.com/do/search?query=', 'Startpage');
    }
})();