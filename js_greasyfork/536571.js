// ==UserScript==
// @name         Jeetbuzz Profile Backlinks Display
// @namespace    https://jeetbuzz.page/
// @version      1.0
// @description  Adds a list of official Jeetbuzz profile backlinks to the page for SEO and visibility.
// @author       Jeetbuzz
// @license      MIT
// @match        https://jeetbuzz.page/*
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/536571/Jeetbuzz%20Profile%20Backlinks%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/536571/Jeetbuzz%20Profile%20Backlinks%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.backgroundColor = '#f4f4f4';
    container.style.border = '1px solid #ccc';
    container.style.marginTop = '20px';

    // Add title
    const title = document.createElement('h2');
    title.innerText = 'Jeetbuzz Profile Backlinks';
    container.appendChild(title);

    // List of backlinks
    const links = [
        { name: 'Behance', url: 'https://www.behance.net/jeetbuzz2' },
        { name: 'Facer', url: 'https://www.facer.io/user/dJjDqlpDV1' },
        { name: '4Shared', url: 'https://www.4shared.com/u/jmp97F1N/seojeet88.html' },
        { name: 'TED', url: 'https://www.ted.com/profiles/49208384' },
        { name: 'Product Hunt', url: 'https://www.producthunt.com/@jeet_seo' },
        { name: 'Unsplash', url: 'https://unsplash.com/@jeetbuzzp' },
        { name: 'Kickstarter', url: 'https://www.kickstarter.com/profile/jeetbuzz247' },
        { name: 'Tumblr', url: 'https://www.tumblr.com/jeetbuzz247' },
        { name: 'About.me', url: 'https://about.me/jeetbuzz247/' },
        { name: 'More...', url: 'https://jeetbuzz.page/' }
    ];

    // Create list
    const ul = document.createElement('ul');
    links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = link.url;
        a.innerText = link.name;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        li.appendChild(a);
        ul.appendChild(li);
    });

    container.appendChild(ul);
    document.body.appendChild(container);
})();
