// ==UserScript==
// @name         Torn Sticky Sidebar
// @namespace    torn.myth.stickysidebar
// @version      0.01
// @description  Torn sticky sidebar
// @author       M02
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505297/Torn%20Sticky%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/505297/Torn%20Sticky%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const settings = {
        scrollbar: {
            scrollbar_width: '0px',
            scrollbar_track_bkg: '#f1f1f1',
            scrollbar_thumb_bkg: '#888',
            scrollbar_thumb_bkg_hover: '#555',
        },
    }

    GM_addStyle(`
              #sidebar {
                position: sticky;
                top: 0;
                max-height: 100vh;
                overflow-y: scroll;
                overflow-x: hidden;
             }

             #sidebar::-webkit-scrollbar {
                width: ${settings.scrollbar.scrollbar_width};
             }
             @media only screen and (max-width: 1001px) {
                 #sidebar::-webkit-scrollbar {
                   width: 0px;
                 }
             }
             #sidebar::-webkit-scrollbar-track {
                background: ${settings.scrollbar.scrollbar_track_bkg};
             }
             #sidebar::-webkit-scrollbar-thumb {
                background: ${settings.scrollbar.scrollbar_thumb_bkg};
             }
             #sidebar::-webkit-scrollbar-thumb:hover {
                background: ${settings.scrollbar.scrollbar_thumb_bkg_hover};
             }
  `);

    window.addEventListener('scroll', function() {
        const sidebar = document.getElementById('sidebar');
        const sidebarRect = sidebar.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (sidebarRect.height > windowHeight) {
            if (window.scrollY > sidebarRect.top) {
                sidebar.style.position = 'fixed';
                sidebar.style.top = '0';
            } else {
                sidebar.style.position = 'sticky';
                sidebar.style.top = '0';
            }
        }
    });


})();