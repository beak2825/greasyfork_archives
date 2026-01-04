// ==UserScript==
// @name         Munzee Links
// @namespace    https://greasyfork.org/users/156194
// @version      0.7
// @description  Show some more links in the navbar
// @author       rabe85
// @match        https://www.munzee.com/
// @match        https://www.munzee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=munzee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40079/Munzee%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/40079/Munzee%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_links() {

        // User eingeloggt?
        var usermenu_logged_in = document.getElementsByClassName('user-name')[0];
        if(usermenu_logged_in) {

            // Munzee Blog
            var blog = '<a class="menu-item   nav-link" href="https://www.munzeeblog.com/"><div class="icon-wrapper MuiBox-root css-0" aria-label="Munzee Blog"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="BookmarkIcon"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"></path></svg></div></a>';

            // Normal Munzee Map
            var map_normal = '<a class="menu-item   nav-link" href="/map"><div class="icon-wrapper MuiBox-root css-0" aria-label="View Munzee Map"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PublicIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg></div></a>';

            // Special Munzees Map
            var map_specials = '<a class="menu-item   nav-link" href="/specials" title="View Special Munzees Map"><div class="icon-wrapper MuiBox-root css-0" aria-label="View Special Munzees Map"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MapIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg><img src="https://www.otb-server.de/munzee/v3pins/nomad.png" alt="Special Map" style="width: 100%;max-width: 12px;height: auto;position: relative;top: 4px;"></div></a>';

            // Places Munzees Map
            var map_places = '<a class="menu-item   nav-link" href="/places" title="View Places Munzee Map"><div class="icon-wrapper MuiBox-root css-0" aria-label="View Places Munzee Map"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MapIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg><img src="https://www.otb-server.de/munzee/v3pins/poi_filter.png" alt="Places Map" style="width: 100%;max-width: 12px;height: auto;position: relative;top: 4px;"></div></a>';

            // Munzee Gardens Map
            var map_gardens = '<a class="menu-item   nav-link" href="/gardens" title="View Munzee Gardens Map"><div class="icon-wrapper MuiBox-root css-0" aria-label="View Munzee Gardens Map"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MapIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg><img src="https://www.otb-server.de/munzee/v3pins/virtual_emerald.png" alt="Gardens Map" style="width: 100%;max-width: 12px;height: auto;position: relative;top: 4px;"></div></a>';

            // Premium Member: New Deploys In Your Area
            var premium_new_deploys = '<a class="menu-item   nav-link" href="https://web.cuppazee.com/maps/new" target="_blank" title="View Special Munzee Map"><div class="icon-wrapper MuiBox-root css-0" aria-label="New Deploys In Your Area"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PublicIcon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg><img src="https://www.otb-server.de/munzee/v3pins/premiumpersonal.png" alt="New Deploys In Your Area" style="width: 100%;max-width: 12px;height: auto;position: relative;top: 4px;"></div></a>';

            // Messages
            var messages = '<a class="menu-item   nav-link" href="/flows"><div class="icon-wrapper MuiBox-root css-0" aria-label="View Messages"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="MailOutlineIcon"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path></svg></div></a>';

            // Leaderboards
            var leaderboards = '<div class="menu-item  nav-item dropdown"><a aria-expanded="false" role="button" class="dropdown-toggle nav-link" tabindex="0" href="#"><div class="icon-wrapper MuiBox-root css-0" aria-label="Leaderboards"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="EmojiEventsIcon"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"></path></svg></div></a></div>';

            // Calendar
            var calendar = '<a class="menu-item   nav-link" href="https://calendar.munzee.com/" target="_blank"><div class="icon-wrapper MuiBox-root css-0" aria-label="Calendar"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CalendarMonthIcon"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"></path></svg></div></a>';

            // STATzee
            var statzee = '<a class="menu-item  tab-d-none nav-link" href="https://statzee.cuppazee.com/" target="_blank"><div class="icon-wrapper MuiBox-root css-0" aria-label="STATzee"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LeaderboardIcon"><path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"></path></svg></div></a>';

            // Store
            var store = '<a class="menu-item   nav-link" href="https://store.freezetag.com/" target="_blank"><div class="icon-wrapper MuiBox-root css-0" aria-label="Store"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RedeemIcon"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"></path></svg></div></a>';

            // Redeem Store
            var redeem_store = '<a class="menu-item   nav-link" href="https://www.munzee.com/redeem/" target="_blank" title="Redeem Store"><div class="icon-wrapper MuiBox-root css-0" aria-label="Redeem Store"><svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RedeemIcon"><path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"><Tooltip title="Delete"><IconButton><DeleteIcon></IconButton></Tooltip></path></svg></div></a>';


            // Navbar erweitern
            var navbar0 = document.getElementsByClassName('menu-item');
            for(var nav = 0, navbar; !!(navbar=navbar0[nav]); nav++) {
                var navbar_aria_label = navbar.getElementsByTagName('div')[0].getAttribute('aria-label');

                // Add new icons after map icon
                if(navbar_aria_label == "View Munzee Map") navbar.insertAdjacentHTML('afterend', map_specials + map_places + map_gardens + premium_new_deploys);

                // Add redeem store after store icon
                if(navbar_aria_label == "Store") navbar.insertAdjacentHTML('afterend', redeem_store);

            }

        }

    }

    // Auf Element der Seite warten
    function daten_gefunden() {
        waitForElm('span.user-name').then((elm) => {
            munzee_links();
        });
    }

    // Daten nachgeladen?
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        daten_gefunden();
    } else {
        document.addEventListener('DOMContentLoaded', daten_gefunden, false);
    }

})();