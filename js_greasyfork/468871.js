// ==UserScript==
// @name         Lemmy Custom Navbar Links
// @namespace    http://tampermonkey.net/
// @version      1.2
// @author       https://lemmy.world/u/0485919158191
// @description  Adds a customizable sticky navbar with quick links on Lemmy instances, including dynamic "My Posts" and "My Comments" for the logged-in user
// @match        https://lemmy.world/*
// @match        https://*.lemmy.world/*
// @match        https://sh.itjust.works/*
// @match        https://*.sh.itjust.works/*
// @match        https://lemmy.ml/*
// @match        https://*.lemmy.ml/*
// @match        https://*/*                  // Broad match, but we check inside if it's Lemmy
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468871/Lemmy%20Custom%20Navbar%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/468871/Lemmy%20Custom%20Navbar%20Links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Reliable Lemmy detection
    function isLemmyPage() {
        return document.body.classList.contains('lemmy') ||
               document.querySelector('nav.navbar') !== null ||
               !!document.querySelector('link[rel="manifest"][href*="lemmy"]') ||
               window.location.hostname.includes('lemmy.');
    }

    if (!isLemmyPage()) return;

    // Detect logged-in username
    function getCurrentUsername() {
        // The profile link in the top-right navbar (when logged in) looks like: <a href="/u/username">
        const profileLink = document.querySelector('nav.navbar a[href^="/u/"]');
        if (profileLink) {
            const match = profileLink.getAttribute('href').match(/^\/u\/([^/?]+)/);
            if (match) return match[1];
        }
        return null;
    }

    const username = getCurrentUsername();

    // Base URL builder
    function buildUrl(path) {
        return 'https://' + window.location.hostname + path;
    }

    // Configuration: easy to modify links
    const customLinks = [
        username ? { title: 'My Posts',     url: `/u/${username}?view=Posts&sort=New&page=1`,          color: '#00C853' } : null,
        username ? { title: 'My Comments',  url: `/u/${username}?view=Comments&sort=New&page=1`,        color: '#00C853' } : null,
        { separator: true },
        { title: 'Sweden',       url: '/c/sweden',                                           color: '#F1641E' },
        { title: 'Outside',         url: '/c/outside',                                             color: '#F1641E' },
        { separator: true },
        { title: 'Plugins',      url: '/c/plugins@sh.itjust.works',                          color: '#000000' },
    ].filter(item => item !== null); // Remove null entries if not logged in

    // Create navbar
    const navbar = document.createElement('div');
    Object.assign(navbar.style, {
        backgroundColor: '#EFF3F5',
        color: '#000000',
        padding: '8px 16px',
        textAlign: 'center',
        position: 'sticky',
        top: '0',
        width: '100%',
        zIndex: '1000',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        fontSize: '14px',
        boxSizing: 'border-box'
    });

    // Build links
    customLinks.forEach((item) => {
        if (item.separator) {
            const sep = document.createElement('span');
            sep.textContent = ' | ';
            sep.style.color = '#999';
            sep.style.margin = '0 8px';
            navbar.appendChild(sep);
        } else {
            const link = document.createElement('a');
            link.textContent = item.title;
            link.href = item.url.startsWith('http') ? item.url : buildUrl(item.url);
            link.target = '_self'; // Same instance

            Object.assign(link.style, {
                color: item.color || '#007bff',
                textDecoration: 'none',
                fontWeight: '500',
                margin: '0 10px',
                transition: 'opacity 0.2s'
            });

            link.addEventListener('mouseenter', () => link.style.opacity = '0.7');
            link.addEventListener('mouseleave', () => link.style.opacity = '1');

            navbar.appendChild(link);
        }
    });

    // Optional: hide "My Posts/Comments" if not logged in
    if (!username) {
        const info = document.createElement('span');
        info.textContent = '(Log in to see My Posts/Comments)';
        info.style.color = '#666';
        info.style.fontStyle = 'italic';
        info.style.marginLeft = '20px';
        navbar.appendChild(info);
    }

    // Insert navbar at the very top
    function insertNavbar() {
        if (document.body) {
            document.body.insertBefore(navbar, document.body.firstChild);
        }
    }

    // Run after DOM is ready (in case navbar elements load late)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertNavbar);
    } else {
        insertNavbar();
    }
})();