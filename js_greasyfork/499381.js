// ==UserScript==
// @name         MediaFire Downloader 
// @namespace    https://bypass-beta.vercel.app/api/mediafire?url=
// @version      1.1
// @description  Bypassing MediaFire To Direct Download
// @author       FeliciaXxx
// @match        https://mediafire.com/*
// @match        https://www.mediafire.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/499381/MediaFire%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/499381/MediaFire%20Downloader.meta.js
// ==/UserScript==
     
    (function() {
        'use strict';
     
        var currenturl = window.location.href;
     
        fetch('https://bypass-beta.vercel.app/api/mediafire?url=' + currenturl)
            .then(response => response.json())
            .then(data => {
                console.log('redirecting to the bypassed link:', data.bypassed);
                window.location.href = data.bypassed;
            })
            .catch(error => console.error('error:', error));
    })();