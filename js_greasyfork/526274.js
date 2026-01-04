// ==UserScript==
// @name         All Cookie Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays cookies for the current page in an overlay
// @author       
// @match        *://*/*
// @grant        none
// @license      free
// @downloadURL https://update.greasyfork.org/scripts/526274/All%20Cookie%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/526274/All%20Cookie%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.id = 'cookieOverlay';
    overlay.innerHTML = `
        <div class="header">
            <h3>Cookies for <span class="domain">${location.hostname}</span></h3>
            <button class="close">×</button>
        </div>
        <div class="content"></div>
    `;

    // Create and append styles
    const style = document.createElement('style');
    style.textContent = `
        #cookieOverlay {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            max-width: 400px;
            max-height: 50vh;
            overflow-y: auto;
            z-index: 9999;
            font-family: Arial, sans-serif;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        #cookieOverlay .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            position: sticky;
            top: 0;
            background: inherit;
        }
        #cookieOverlay .close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0 8px;
            margin-left: 10px;
        }
        #cookieOverlay .close:hover {
            color: #ff4444;
        }
        #cookieOverlay .content {
            font-size: 14px;
            line-height: 1.4;
        }
        #cookieOverlay .cookie-item {
            margin: 8px 0;
            padding: 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            word-break: break-word;
        }
        #cookieOverlay .domain {
            color: #00ff9d;
            font-weight: bold;
        }
    `;
    document.body.appendChild(style);
    document.body.appendChild(overlay);

    // Update cookie display function
    function updateCookieDisplay() {
        const domainSpan = overlay.querySelector('.domain');
        const contentDiv = overlay.querySelector('.content');
        
        domainSpan.textContent = location.hostname;
        contentDiv.innerHTML = '';

        const cookies = document.cookie.split('; ').filter(Boolean);
        
        if (cookies.length === 0) {
            contentDiv.innerHTML = '<div class="cookie-item">No cookies found</div>';
            return;
        }

        cookies.forEach(cookie => {
            const [key, ...valueParts] = cookie.split('=');
            const value = valueParts.join('=');
            const cookieDiv = document.createElement('div');
            cookieDiv.className = 'cookie-item';
            cookieDiv.innerHTML = `
                <strong>${key.trim()}</strong>: <span class="cookie-value">${decodeURIComponent(value)}</span>
            `;
            contentDiv.appendChild(cookieDiv);
        });
    }

    // Event listeners for page changes
    const updateEvents = ['load', 'DOMContentLoaded', 'popstate', 'pushState', 'replaceState'];
    updateEvents.forEach(event => window.addEventListener(event, updateCookieDisplay));

    // Monitor history changes for SPAs
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        window.dispatchEvent(new Event('pushState'));
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        window.dispatchEvent(new Event('replaceState'));
    };

    // Close button functionality
    overlay.querySelector('.close').addEventListener('click', () => {
        overlay.style.display = 'none';
        localStorage.setItem('cookieOverlayHidden', 'true');
    });

    // Persist visibility state across page loads
    if (localStorage.getItem('cookieOverlayHidden') === 'true') {
        overlay.style.display = 'none';
    } else {
        overlay.style.display = 'block';
    }

    // Initial update
    updateCookieDisplay();
})();