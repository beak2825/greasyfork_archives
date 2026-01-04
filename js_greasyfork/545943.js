// ==UserScript==
// @name         Force Light Mode for LikeC4 Apps
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Force light theme on LikeC4 static web apps regardless of OS/browser theme
// @icon         https://likec4.dev/favicon.svg
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545943/Force%20Light%20Mode%20for%20LikeC4%20Apps.user.js
// @updateURL https://update.greasyfork.org/scripts/545943/Force%20Light%20Mode%20for%20LikeC4%20Apps.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Utility: Check if it's a LikeC4 app (basic heuristic)
    function isLikeC4App() {
        return document.querySelector('[data-likec4-app]') !== null ||
               document.querySelector('meta[name="generator"][content*="likec4"]') ||
               document.querySelector('#likec4-root');
    }

    // Override theme detection
    function forceLightTheme() {
        // Override prefers-color-scheme
        const style = document.createElement('style');
        style.textContent = `
            @media (prefers-color-scheme: dark) {
                :root {
                    color-scheme: light !important;
                }
            }
        `;
        document.head.appendChild(style);

        document.documentElement.setAttribute('data-mantine-color-scheme', 'light');
    }

    window.addEventListener('load', () =>{
        if (isLikeC4App()) {
            //console.log('found likec4 site')

            forceLightTheme();
        }
        else {
            //console.log('no likec4 site found');
        }
    });
})();