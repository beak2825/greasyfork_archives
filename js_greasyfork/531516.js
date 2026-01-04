    // ==UserScript==
    // @name         Web Performance Enhancer - Firefox & Firefox Forks
    // @namespace    http://tampermonkey.net/
    // @version      1.4
    // @description  Quicklink Enabling for Firefox & Firefox Forks
    // @author       DR LEVONK
    // @match        *://*/*
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531516/Web%20Performance%20Enhancer%20-%20Firefox%20%20Firefox%20Forks.user.js
// @updateURL https://update.greasyfork.org/scripts/531516/Web%20Performance%20Enhancer%20-%20Firefox%20%20Firefox%20Forks.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        // Load Quicklink library to enhance link prefetching
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/quicklink@2.0.0/dist/quicklink.umd.js';
        script.onload = () => {
            if (typeof quicklink !== 'undefined') {
                try {
                    quicklink.listen({
                        origins: true,
                        ignores: [
                            (uri) => uri.includes('logout'),
                            (uri) => uri.includes('login'),
                            (uri) => uri.includes('account')
                        ]
                    });
                } catch (error) {
                    console.error('Error initializing Quicklink:', error);
                }
            } else {
                console.error('Quicklink library is not available.');
            }
        };
        script.onerror = () => {
            console.error('Error loading Quicklink library.');
        };
        document.head.appendChild(script);
     
        // Global error listener
        window.addEventListener('error', (event) => {
            console.error('Script error:', event.message, 'at', event.filename, 'line', event.lineno);
        });
     
        // Prevent navigation to logout, login, or account pages on link clicks
        document.addEventListener('click', (event) => {
            const target = event.target.closest('a[href]');
            if (target && (target.href.includes('logout') || target.href.includes('login') || target.href.includes('account'))) {
                event.preventDefault();
                console.warn('Prevented navigation to:', target.href);
            }
        });
     
        // Prevent 503 errors by sending keep-alive requests
        const sendKeepAlive = () => {
            const url = '/keep-alive';
            if (navigator.sendBeacon) {
                try {
                    navigator.sendBeacon(url, '');
                } catch (error) {
                    console.error('Error sending beacon:', error);
                }
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                xhr.onerror = () => {
                    console.error('Error with keep-alive request:', xhr.statusText);
                };
                xhr.send('');
            }
        };
        setInterval(sendKeepAlive, 300000); // Send keep-alive request every 5 minutes
     
    })();