

    // ==UserScript==
    // @name         Redirect Apple Music to Windows App
    // @namespace    https://tampermonkey.net/
    // @version      1.12
    // @description  Redirect Apple Music URLs to the Apple Music Windows app.
    // @author       BunCat09
    // @icon         https://music.apple.com/assets/favicon/favicon-180.png
    // @match        https://music.apple.com/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521450/Redirect%20Apple%20Music%20to%20Windows%20App.user.js
// @updateURL https://update.greasyfork.org/scripts/521450/Redirect%20Apple%20Music%20to%20Windows%20App.meta.js
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        // Redirect Apple Music URLs to the Apple Music app
        const url = window.location.href;
        const appUrl = url.replace("https://music.apple.com", "music://music.apple.com");
     
        // Launch the app
        window.location.href = appUrl;
     
        // Close the browser tab
        setTimeout(() => {
            window.close();
        }, 1000); // Wait for redirection to ensure the app launches
    })();

