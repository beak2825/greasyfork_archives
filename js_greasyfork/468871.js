// ==UserScript==
// @name         Lemmy Custom Navbar Links with Scroll to Top
// @namespace    http://tampermonkey.net/
// @version      1.6
// @author       https://lemmy.world/u/0485919158191 (original) + modifications
// @description  Adds a customizable sticky navbar with quick links on Lemmy instances, including dynamic "My Posts" and "My Comments" for the logged-in user. Also adds a "Scroll to Top" button in the navbar.
// @match        https://lemmy.world/*
// @match        https://*.lemmy.world/*
// @match        https://sh.itjust.works/*
// @match        https://*.sh.itjust.works/*
// @match        https://lemmy.ml/*
// @match        https://*.lemmy.ml/*
// @match        https://*/*                  // Broad match, but we check inside if it's Lemmy
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468871/Lemmy%20Custom%20Navbar%20Links%20with%20Scroll%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/468871/Lemmy%20Custom%20Navbar%20Links%20with%20Scroll%20to%20Top.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Lemmy detection
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

    // Configuration: easy to modify links (added Scroll to Top as a special item)
    const customLinks = [
        username ? { title: 'My Posts',     url: `/u/${username}?view=Posts&sort=New&page=1`,          color: '#00C853' } : null,
        username ? { title: 'My Comments',  url: `/u/${username}?view=Comments&sort=New&page=1`,        color: '#00C853' } : null,
        { separator: true },
        { title: 'Sweden',       url: '/c/sweden',                                           color: '#F1641E' },
        { title: 'Outside',         url: '/c/outside',                                             color: '#F1641E' },
        { separator: true },
        { title: 'Plugins',      url: '/c/plugins@sh.itjust.works',                          color: '#000000' },
        { separator: true },
        { title: 'Scroll to top ↑', action: 'scrollToTop', color: '#007bff' }
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
        } else if (item.action === 'scrollToTop') {
            // Create button for Scroll to Top
            const btn = document.createElement('button');
            btn.textContent = item.title;
            btn.title = 'Back to top';

            Object.assign(btn.style, {
                color: item.color || '#007bff',
                background: 'transparent',
                border: 'none',
                fontWeight: '500',
                margin: '0 10px',
                cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.2s',
                fontSize: '16px',  // Slightly larger for arrow
                padding: '0',
                opacity: 1,  // Default visible; comment out if using show/hide
            });

            btn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

            // Show button only after scrolling
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
            btn.style.transition = 'all 0.3s ease';
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    btn.style.opacity = '1';
                    btn.style.visibility = 'visible';
                } else {
                    btn.style.opacity = '0';
                    btn.style.visibility = 'hidden';
                }
            });

            navbar.appendChild(btn);
        } else {
            // Regular link
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

            navbar.appendChild(link);
        }
    });

    // Insert navbar at the very top
    function insertNavbar() {
        if (document.body) {
            document.body.insertBefore(navbar, document.body.firstChild);
        }
    }

    // Run after DOM is ready
    function init() {
        insertNavbar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();