// ==UserScript==
// @name         Make YouTube Music Lyrics Bigger!
// @namespace    https://gist.github.com/nakanakaii/18963577649449e20c65f373496b8006
// @version      2025-03-31
// @description  Increase the size of lyrics on YouTube Music!
// @author       https://github.com/nakanakii
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/542494/Make%20YouTube%20Music%20Lyrics%20Bigger%21.user.js
// @updateURL https://update.greasyfork.org/scripts/542494/Make%20YouTube%20Music%20Lyrics%20Bigger%21.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('make Youtube Music lyrics bigger!');

    // Check if the website is not music.youtube.com and cancel the function
    if (document.location.host !== 'music.youtube.com') {
        console.log('site is not music.youtube.com');
        return;
    }

    // Create a new <style> element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
        yt-formatted-string.description {
            font-size: 2.5em !important;
            text-align: center !important;
            padding: 0 12px !important;
        }
    `;

    // Append the <style> element to the <head> section
    document.head.appendChild(style);
    console.log('style object injected successfully')
})();