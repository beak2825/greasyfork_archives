// ==UserScript==
// @name         GE/spontacts unblur profile visitors
// @namespace    http://tampermonkey.net/
// @version      2023-12-15
// @description  Unblurs profile visitors and makes 'em clickable
// @author       You
// @match        https://community.gemeinsamerleben.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gemeinsamerleben.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497379/GEspontacts%20unblur%20profile%20visitors.user.js
// @updateURL https://update.greasyfork.org/scripts/497379/GEspontacts%20unblur%20profile%20visitors.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.feed-item.visitors').forEach((feed) => {
        const image = feed.querySelector('img');
        if(image) {
            try {
                const profileId = image.src.match(/userpics\/(.*?)\/profile/)[1];
                feed.style.cursor = 'pointer';
                feed.addEventListener('click', (evt) => {
                    window.location = `https://community.gemeinsamerleben.com/u/${profileId}`;
                    evt.stopPropagation();
                }, true);
            } catch {
            }
        }
    });

    document.querySelectorAll('.notauthorized img.user').forEach((image) => {
        image.style.filter = 'none';
    });

})();