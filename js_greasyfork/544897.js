// ==UserScript==
// @name         Jannyitor
// @namespace    FauxFire.FMG.Userscripts
// @version      1.1.1
// @description  Hop between Janitor and Janny
// @author       FauxFire
// @match        https://janitorai.com/*
// @match        https://jannyai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=janitorai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544897/Jannyitor.user.js
// @updateURL https://update.greasyfork.org/scripts/544897/Jannyitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Which site are we on?
    const isJanitor = window.location.hostname.includes('janitorai.com');
    
    // Calculate target URL
    let targetUrl = window.location.href;
    targetUrl = isJanitor ? targetUrl.replace('janitorai', 'jannyai') : targetUrl.replace('jannyai', 'janitorai');
    targetUrl = isJanitor ? targetUrl.replace('profiles', 'creators') : targetUrl.replace('creators', 'profiles');

    // Create the floating button
    const button = document.createElement('button');
    button.textContent = isJanitor ? 'To Janny →' : '← To Janitor';
    
    // Button styling
    Object.assign(button.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '9999',
        padding: '12px 16px',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: isJanitor ? '#0f5a8b' : '#ff69b4',
        color: isJanitor ? '#fff' : '#000',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.2s ease'
    });

    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    // Click handler
    button.addEventListener('click', () => {
        window.open(targetUrl, '_blank');
    });

    // Add button to page
    document.body.appendChild(button);
})();