// ==UserScript==
// @name         Roblox - Material Design Lite Header Only
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Apply Material Design Lite to Roblox header and sidebar, removing other content
// @author       YourName
// @match        *://www.roblox.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/507563/Roblox%20-%20Material%20Design%20Lite%20Header%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/507563/Roblox%20-%20Material%20Design%20Lite%20Header%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load Material Design Lite CSS and Google Icons
    const mdlCSS = document.createElement('link');
    mdlCSS.rel = 'stylesheet';
    mdlCSS.href = 'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css';
    document.head.appendChild(mdlCSS);

    const googleIconsCSS = document.createElement('link');
    googleIconsCSS.rel = 'stylesheet';
    googleIconsCSS.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    document.head.appendChild(googleIconsCSS);

    // Load Material Design Lite JavaScript
    const mdlScript = document.createElement('script');
    mdlScript.src = 'https://code.getmdl.io/1.3.0/material.min.js';
    mdlScript.defer = true;
    document.head.appendChild(mdlScript);

    // Inject custom styling for the layout (Header and Sidebar)
    GM_addStyle(`
        /* Custom Styling for Header */
        .mdl-layout__header {
            background-color: #3F51B5;
            color: white;
        }

        .mdl-layout__header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .mdl-layout-title {
            font-size: 24px;
            font-weight: bold;
        }

        .mdl-navigation__link {
            color: white;
            font-size: 16px;
            padding: 0 20px;
        }

        /* Sidebar Styles */
        .mdl-layout__drawer {
            background-color: #2C3E50;
        }

        .mdl-layout__drawer .mdl-navigation__link {
            color: white;
            font-size: 18px;
            padding: 10px 20px;
        }

        /* Hide all other content */
        body > *:not(header):not(.mdl-layout__drawer) {
            display: none !important;
        }
    `);

    // Create the new HTML layout with header and sidebar only
    const newLayout = `
        <!-- Header -->
        <header class="mdl-layout__header mdl-layout__header--scroll mdl-color--primary">
            <div class="mdl-layout__header-row">
                <!-- Title -->
                <span class="mdl-layout-title">Roblox</span>
                <div class="mdl-layout-spacer"></div>
                <!-- Navigation -->
                <nav class="mdl-navigation">
                    <a class="mdl-navigation__link" href="#home">Home</a>
                    <a class="mdl-navigation__link" href="#games">Games</a>
                    <a class="mdl-navigation__link" href="#store">Store</a>
                    <a class="mdl-navigation__link" href="#about">About</a>
                </nav>
            </div>
        </header>

        <!-- Sidebar (Drawer) -->
        <div class="mdl-layout__drawer">
            <span class="mdl-layout-title">Roblox Menu</span>
            <nav class="mdl-navigation">
                <a class="mdl-navigation__link" href="#profile">Profile</a>
                <a class="mdl-navigation__link" href="#friends">Friends</a>
                <a class="mdl-navigation__link" href="#messages">Messages</a>
                <a class="mdl-navigation__link" href="#settings">Settings</a>
            </nav>
        </div>
    `;

    // Insert the new layout into the body
    document.body.innerHTML = newLayout;

})();
