// ==UserScript==
// @name         [not working]Terabox video link unlock (redirect to embed)
// @author       Rust1667
// @version      1.2
// @description  Redirect Terabox video links to embed links
// @match        https://*.terabox.com/*
// @match        https://*.mirrobox.com/*
// @match        https://*.nephobox.com/*
// @match        https://*.freeterabox.com/*
// @match        https://*.1024tera.com/*
// @match        https://*.4funbox.co/*
// @match        https://*.4funbox.com/*
// @match        https://*.terabox.app/*
// @match        https://*.terabox.fun/*
// @match        https://*.momerybox.com/*
// @match        https://*.teraboxapp.com/*
// @match        https://*.tibibox.com/*
// @match        https://*.gibibox.com/*
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/528908/%5Bnot%20working%5DTerabox%20video%20link%20unlock%20%28redirect%20to%20embed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528908/%5Bnot%20working%5DTerabox%20video%20link%20unlock%20%28redirect%20to%20embed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Video file extensions to check
    const videoExtensions = [
        '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm',
        '.m4v', '.mpg', '.mpeg', '.mp2', '.mpe', '.ogv', '.3gp'
    ];

    // Check if the current URL is a sharing link and page title contains a video extension
    if (window.location.href.includes('/sharing/link?')) {
        // Check if document title contains any video extension
        const hasVideoExtension = videoExtensions.some(ext =>
            document.title.toLowerCase().includes(ext.toLowerCase())
        );

        // Redirect only if a video extension is found
        if (hasVideoExtension) {
            window.location.assign(window.location.href.replace('/sharing/link?', '/sharing/embed?'));
        }
    }
})();
