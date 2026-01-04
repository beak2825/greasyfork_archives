// ==UserScript==
// @name         YouTube - Save to playlist menu sorted alphabetically
// @namespace    DoniaCometa.YouTube.SaveToPlaylistAlphabetically
// @license      MIT
// @version      1.01
// @description  Save to playlist menu sorted alphabetically
// @author       DoniaCometa
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @match        http*://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/450181/YouTube%20-%20Save%20to%20playlist%20menu%20sorted%20alphabetically.user.js
// @updateURL https://update.greasyfork.org/scripts/450181/YouTube%20-%20Save%20to%20playlist%20menu%20sorted%20alphabetically.meta.js
// ==/UserScript==
/************************************************************************/
function getMenuAddToPlaylists() {
    return document.getElementById("playlists");
}
function getMenuAddToPlaylistsVisibilityParent() {
    let menuAddToPlaylists = getMenuAddToPlaylists();
    if (menuAddToPlaylists == null) {
        return null;
    }
    return menuAddToPlaylists.parentNode.parentNode;
}
function getMenuAddToPlaylistsIsVisible() {
    menuAddToPlaylistsVisibilityParent = getMenuAddToPlaylistsVisibilityParent();
    if (menuAddToPlaylistsVisibilityParent == null) {
        return false;
    }
    return window.getComputedStyle(menuAddToPlaylistsVisibilityParent).display === "block";
}
function stringLocaleCompare(a, b) {
    // for sorting string with emojis icons/emojis and keeping them on top
    // https://stackoverflow.com/questions/59589337/in-javascript-sorting-strings-with-numbers-and-special-characters
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}
function sortMenuAddToPlaylists() {
    function getPlaylistTitle(playlistElement) {
        return playlistElement.children[0].children[1].children[0].children[0].children[0].title.toLowerCase();
    }
    let playlists = getMenuAddToPlaylists();
    let sorted = true;
    while (sorted) {
        sorted = false;
        for (let i = 1; i < playlists.children.length - 1; i++) {
            let a = playlists.children[i];
            let b = playlists.children[i + 1];
            if (stringLocaleCompare(getPlaylistTitle(a), getPlaylistTitle(b)) > 0) {
                playlists.insertBefore(b, a);
                sorted = true;
            }
        }
    }
}
function canInit() {
    return getMenuAddToPlaylistsIsVisible();
}
function init() {
    sortMenuAddToPlaylists();
    let intervalId = window.setInterval(function () {
        if (getMenuAddToPlaylistsIsVisible()) {
            sortMenuAddToPlaylists();
        }
    }, 1);
}
/************************************************************************/
(function () {
    'use strict';
    // Your code here...
    let intervalId = window.setInterval(function () {
        if (canInit()) {
            init();
            clearInterval(intervalId);
        }
    }, 100);
})();

