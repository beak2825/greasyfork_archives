// ==UserScript==
// @name            Google Search Sidebar
// @namespace       AVT BRNO
// @version         0.5.0
// @description     A user script and user style to move Google search tools to sidebar.
// @author          Lubos
// @license         MIT
// @include         /^https:\/\/(?:ipv4|ipv6|www)\.google\.(?:[a-z\.]+)\/search\?(?:.+&)?q=[^&]+(?:&.+)?$/
// @exclude         /^https:\/\/(?:ipv4|ipv6|www)\.google\.(?:[a-z\.]+)\/search\?(?:.+&)?tbm=lcl(?:&.+)?$/
// @compatible      firefox
// @compatible      chrome
// @compatible      edge
// @compatible      opera
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/526305/Google%20Search%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/526305/Google%20Search%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function GM_addStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
        return style;
    }

    GM_addStyle(`
        /** CSS Variables **/
        :root {
            --user-sidebar-width: 250px;
            --user-sidebar-spacer: 30px;
            --user-sidebar-primary-color: #dd4b39;
            --user-action-menu-spacer: 1px;
            --user-action-menu-background: rgba(0, 0, 0, 0.1);
            --user-action-menu-font-size: 85%;
        }

        /** Skrytí statistiky výsledkù **/
        #result-stats {
            display: none !important;
        }

        /** Nástroje **/
        #hdtbMenus {
            all: unset !important;
            display: block !important;
            position: fixed !important;
            top: 0;
            left: 0;
            width: var(--user-sidebar-width);
            height: 100vh;
            background-color: #f4f4f4;
            z-index: 999;
            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
            padding: 10px;
        }

        /** Hlavní vyhledávací obsah **/
        #appbar, #center_col, #rcnt {
            position: relative !important;
            margin-left: calc(var(--user-sidebar-width) - 100px) !important; /* Posuneme obsah blíe k nástrojùm */
            width: calc(100% - var(--user-sidebar-width) + 50%) !important; /* Rozíøíme obsah o 50% */
            margin-right: 0 !important;
            padding: 0 !important;
            left: 0 !important;
        }

        /** Nastavení vzhledu nástrojù **/
        #hdtbMenus div[id^="tn_"][id$="_1"] {
            display: flex !important;
            flex-direction: column !important;
            gap: var(--user-sidebar-spacer) !important;
        }

        #hdtbMenus div[id^="tn_"][id$="_1"] > div:nth-child(1) {
            display: none !important;
        }

        #hdtbMenus div[id^="tn_"][id$="_1"] g-popup > div:nth-child(2) {
            all: unset !important;
            display: block !important;
            position: static !important;
            width: calc(var(--user-sidebar-width) - 20px) !important;
            max-width: calc(var(--user-sidebar-width) - 20px) !important;
        }

        /** Zajitìní správné pozice pravého panelu **/
        #rhs {
            margin-left: calc(var(--user-sidebar-width) + 10px) !important;
        }

        /** Úpravy pro akèní menu **/
        div.g g-popup > div {
            display: none !important;
        }

        div.g div.pkWBse {
            all: unset !important;
            display: inline-block !important;
        }

        div.g div.pkWBse g-menu {
            all: unset !important;
            display: flex !important;
            flex-direction: row !important;
            gap: var(--user-action-menu-spacer) !important;
        }

        div.g div.pkWBse g-menu-item {
            all: unset !important;
        }

        div.g div.pkWBse g-menu-item > div {
            all: unset !important;
        }

        div.g div.pkWBse g-menu-item a {
            padding: 0 5px !important;
            background-color: var(--user-action-menu-background) !important;
            font-size: var(--user-action-menu-font-size) !important;
        }

        /* Nový kód pro vynucení íøky a pozice */
        #center_col {
            width: calc(100% - 250px + 50%) !important;
            margin-left: 0 !important; 
        }

        #appbar, #center_col, #rcnt {
            position: relative !important;
            left: 0 !important;
        }
    `);
})();