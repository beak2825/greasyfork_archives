// ==UserScript==
// @name         GitHub Gist Link
// @description  Adds a Gist link to GitHub profile pages.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.2
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @exclude      https://gist.github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528089/GitHub%20Gist%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/528089/GitHub%20Gist%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGistLink() {
        const usernameElement = document.querySelector('.p-nickname.vcard-username');
        if (usernameElement && !usernameElement.querySelector('.gist-link-userscript')) {
            const currentURL = window.location.pathname;
            const username = currentURL.split('/')[1];
            const linkContainer = document.createElement('span');
            linkContainer.className = 'gist-link-container';
            const gistLink = document.createElement('a');
            gistLink.href = `https://gist.github.com/${username}`;
            gistLink.textContent = 'Gist';
            gistLink.className = 'Link--secondary gist-link-userscript';
            gistLink.style.textDecoration = 'none';
            linkContainer.appendChild(gistLink);
            linkContainer.appendChild(document.createTextNode(' · '));
            usernameElement.insertBefore(linkContainer, usernameElement.firstChild);
        }
    }
    setTimeout(addGistLink, 500);
    const observer = new MutationObserver(function(mutations) {
        const isProfilePage = /^\/[^\/]+\/?$/.test(window.location.pathname);
        if (isProfilePage) {
            addGistLink();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    window.addEventListener('popstate', addGistLink);
    window.addEventListener('pushstate', addGistLink);
    window.addEventListener('replacestate', addGistLink);
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(addGistLink, 300);
        }
    }).observe(document, {subtree: true, childList: true});
})();