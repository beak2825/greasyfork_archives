// ==UserScript==
// @name         Disable Playlist Blur Background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables the playlist blur background when you view a playlist
// @author       TB-303
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453963/Disable%20Playlist%20Blur%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/453963/Disable%20Playlist%20Blur%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    GM_addStyle
    (`.immersive-header-background-wrapper.ytd-playlist-header-renderer {
    display: none;
    }
   `);

})();