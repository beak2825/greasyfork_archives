// ==UserScript==
// @name         Fix Gmail Email Search
// @namespace    https://github.com/gserafini/fix-gmail-email-search-userscript/
// @version      1.5.1
// @description  Improved version of the old "Emails" quick search functionality in Gmail, one click to view all emails you've sent or received from any address
// @author       Gabriel Serafini
// @license      MIT
// @donate       If you like this, PayPal a little love to gserafini@gmail.com (or https://paypal.me/SerafiniStudios )
// @screenshot   https://raw.githubusercontent.com/gserafini/fix-gmail-email-search-userscript/master/fix-gmail-email-search-screenshot.png
// @icon         https://raw.githubusercontent.com/gserafini/fix-gmail-email-search-userscript/master/SearchEmails_icon.png
// @match        *://mail.google.com/*
// @match        *://contacts.google.com/*
// @match        *://gmail.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380657/Fix%20Gmail%20Email%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/380657/Fix%20Gmail%20Email%20Search.meta.js
// ==/UserScript==

// Changelog:
// v1.5.1 - Bug fix: Fixed @match directive for contacts.google.com to support
//          Google Workspace accounts with /u/1/ paths (hovercards now work on all accounts)
// v1.5.0 - Major rewrite: Removed jQuery dependency, now uses pure vanilla JavaScript
//          No longer requires separate TrustedHTML bypass script
//          Uses native DOM methods (createElement, createElementNS) instead of innerHTML
//          Smaller, faster, and bypasses TrustedTypes restrictions without workarounds

(function() {
    'use strict';

    // Add styles using textContent (no TrustedTypes issues)
    var style = document.createElement('style');
    style.textContent = '.email_search_icon { outline: none; position: relative; z-index: 0; padding: 0 4px; margin: 0; top: 2px; cursor: pointer; } ' +
                        '.email_search_icon svg { fill: #600; } ' +
                        '.email_search_icon svg:hover { fill: #f00; }';
    document.head.appendChild(style);

    // Create search icon element using DOM methods (no innerHTML)
    function createEmailSearchIcon(emailAddress) {
        var span = document.createElement('span');
        span.className = 'email_search_icon';
        span.title = 'Click to search for all emails with ' + emailAddress;
        span.setAttribute('email', emailAddress);

        // Create SVG using createElementNS
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('height', '1em');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '1em');

        var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z');

        var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M0 0h24v24H0z');
        path2.setAttribute('fill', 'none');

        svg.appendChild(path1);
        svg.appendChild(path2);
        span.appendChild(svg);

        return span;
    }

    // Check if element already has icon
    function hasIcon(element) {
        var prev = element.previousElementSibling;
        return prev && prev.classList.contains('email_search_icon');
    }

    function insertEmailSearchIcons() {
        // Find Gmail email elements (.gD class)
        var gdElements = document.querySelectorAll('.gD');
        for (var i = 0; i < gdElements.length; i++) {
            var el = gdElements[i];
            if (!hasIcon(el)) {
                var email = el.getAttribute('email');
                if (email) {
                    var gdIcon = createEmailSearchIcon(email);
                    el.parentNode.insertBefore(gdIcon, el);
                }
            }
        }

        // Find mailto links (excluding contenteditable divs)
        var mailtoLinks = document.querySelectorAll('a[href^="mailto:"]');
        for (var j = 0; j < mailtoLinks.length; j++) {
            var link = mailtoLinks[j];
            // Skip if inside contenteditable div
            var inEditable = link.closest('div[contenteditable="true"]');
            if (!inEditable && !hasIcon(link)) {
                var href = link.getAttribute('href');
                var emailAddr = href.replace('mailto:', '');
                var mailtoIcon = createEmailSearchIcon(emailAddr);
                link.parentNode.insertBefore(mailtoIcon, link);
            }
        }
    }

    // Poll periodically for newly created elements
    setInterval(insertEmailSearchIcons, 300);

    // Handle click events using event delegation
    document.addEventListener('click', function(event) {
        var target = event.target;

        // Find closest .email_search_icon (handles clicks on SVG children)
        var icon = target.closest('.email_search_icon');
        if (!icon) return;

        event.stopPropagation();

        var email = icon.getAttribute('email');

        if (window.self === window.top) {
            // Main window - perform search
            var searchInput = document.querySelector('input[name="q"]');
            var searchButton = document.querySelector('button[aria-label="Search mail"]');

            if (searchInput && searchButton) {
                searchInput.value = email;
                searchButton.click();
            }
        } else {
            // Iframe (hovercard) - send message to parent
            window.parent.postMessage('searchForEmail=' + email, '*');
        }
    });

    // Listen for messages from iframe (hovercard)
    if (window.self === window.top) {
        window.addEventListener('message', function(event) {
            if (event.origin === 'https://contacts.google.com' &&
                typeof event.data === 'string' &&
                event.data.indexOf('searchForEmail=') !== -1) {

                var email = event.data.replace('searchForEmail=', '');
                var searchInput = document.querySelector('input[name="q"]');
                var searchButton = document.querySelector('button[aria-label="Search mail"]');

                if (searchInput && searchButton) {
                    searchInput.value = email;
                    searchButton.click();
                }
            }
        });
    }

})();
