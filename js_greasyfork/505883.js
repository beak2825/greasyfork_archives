// ==UserScript==
// @name         Custom YouTube Interface
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Customize YouTube interface by hiding certain elements and making modifications.
// @author       You
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505883/Custom%20YouTube%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/505883/Custom%20YouTube%20Interface.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS to hide certain elements and apply custom styles
    GM_addStyle(`
        /* Hide Like and Dislike buttons */
        ytd-toggle-button-renderer.style-scope.ytd-video-primary-info-renderer {
            display: none !important;
        }

        /* Hide Download and Save buttons */
        ytd-menu-renderer.style-scope.ytd-video-primary-info-renderer ytd-menu-popup-renderer {
            display: none !important;
        }

        /* Hide Description */
        #description {
            display: none !important;
        }

        /* Hide Comments */
        #comments {
            display: none !important;
        }

        /* Hide Shorts */
        ytd-rich-grid-media[is-shorts] {
            display: none !important;
        }

        /* Make video list on watch page bigger */
        ytd-playlist-video-list-renderer {
            width: 100% !important;
        }

        /* Replace logo with back button */
        #logo {
            display: none !important;
        }

        #back-button {
            position: absolute;
            top: 10px;
            left: 10px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 5px;
            cursor: pointer;
        }

        #back-button:hover {
            background: #f0f0f0;
        }

        /* Adjust Search bar to be an icon */
        #search {
            display: none !important;
        }

        #search-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            background: url('path_to_icon_image') no-repeat center;
            width: 24px;
            height: 24px;
            cursor: pointer;
        }
    `);

    // JavaScript to create a back button
    const backButton = document.createElement('div');
    backButton.id = 'back-button';
    backButton.textContent = 'Back'; // You can change this text or use an icon
    document.body.appendChild(backButton);
    backButton.addEventListener('click', () => window.history.back());

    // JavaScript to create a search icon
    const searchIcon = document.createElement('div');
    searchIcon.id = 'search-icon';
    document.body.appendChild(searchIcon);
    searchIcon.addEventListener('click', () => {
        const searchField = document.querySelector('input#search');
        if (searchField) {
            searchField.focus();
        }
    });

})();
