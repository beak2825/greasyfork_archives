// ==UserScript==
// @name         SoundCloud Keybinder
// @version      1.0
// @description  Allows for customization of SoundCloud keybinds, and adds a keybind to open the Add to Playlist menu.
// @author       bhackel
// @match        https://soundcloud.com/*
// @grant        none
// @run-at       document-end
// @noframes
// @namespace    https://greasyfork.org/en/users/324178-bhackel
// @downloadURL https://update.greasyfork.org/scripts/422860/SoundCloud%20Keybinder.user.js
// @updateURL https://update.greasyfork.org/scripts/422860/SoundCloud%20Keybinder.meta.js
// ==/UserScript==
// jshint esversion: 6

(function() {
    'use strict';

    /****** Settings ******/
    let blockedKeys = []; // List of keys that will be blocked. Ex: ['r', 'l'];
    let addToPlaylistKey = 'a'; // Key for opening the Add to Playlist menu for the active song
    /****** Settings ******/

    let keybinder = function (event) {
        // Do nothing if the user is typing in a text box
        if (document.activeElement.tagName === 'INPUT') {
            return;
        }
        // Block keypresses specified in list
        else if (blockedKeys.includes(event.key)) {
            // Prevent other listeners from doing anything
            event.stopPropagation();
        }
        // Add keybind for Add to Playlist hotkey
        else if (event.key === addToPlaylistKey) {
            openLoadQueue();
        }
    };

    // Insert the listener above the default onkeydown listener
    window.addEventListener("keydown", keybinder, true);


    /* Functions for the Add to Playlist hotkey */

    // Opens and waits for the song queue to load
    function openLoadQueue() {
        // Check if it is already open
        let queue = document.querySelector('.m-queueVisible');
        if (queue === null) {
            let queueButton = document.querySelector('.playbackSoundBadge__queueCircle');
            queueButton.click();
            setTimeout(openLoadQueue, 500);
            return;
        }
        // If queue gets opened, wait for it to load before running next part
        setTimeout(openAddToPlaylist, 1250);
    }

    // With an open and loaded queue, clicks the Add to Playlist menu
    function openAddToPlaylist() {
        // Close queue
        let queueButton = document.querySelector('.playbackSoundBadge__queueCircle');
        queueButton.click();
        // Open the menu with additional actions
        let activeSong = document.querySelector('.queueItemView.sc-border-box.sc-font-light.m-active');
        let moreButton = activeSong.querySelector('.sc-button-more');
        moreButton.click();
        // Click the Add to Playlist button
        let menuActions = document.querySelector('.moreActions');
        let addToPlaylist = document.querySelector('.sc-button-addtoset');
        addToPlaylist.click();
        // Put focus back on play/pause button
        document.querySelector('.playControl').focus();
    }
})();