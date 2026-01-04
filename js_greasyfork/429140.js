// ==UserScript==
// @name         Apple_Music/download_link
// @namespace    https://aplossless.decrypt.site
// @version      1.0
// @description  Download Apple Music Lossless
// @match        https://music.apple.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429140/Apple_Musicdownload_link.user.js
// @updateURL https://update.greasyfork.org/scripts/429140/Apple_Musicdownload_link.meta.js
// ==/UserScript==

const re = /storefronts.(\w+)/;

(function() {
    'use strict';

    new MutationObserver(function() {
        const tracks = document.querySelector('div.product-info div.songs-list');
        if (!tracks || document.querySelector('a.downLinks')) return;

        let storefront;
        const amp_cache = JSON.parse(document.querySelector('script#shoebox-media-api-cache-amp-music').innerHTML);
        for (const key in amp_cache) {
            const matches = re.exec(key);
            if (matches) {
                storefront = matches[1];
                break;
            }
        }

        const ids = [];
        tracks.querySelectorAll('div.songs-list-row--song').forEach(e => {
            const btn = e.querySelector('button.preview-button');
            const id = JSON.parse(btn.getAttribute('data-metrics-click')).targetId;
            const url = `https://aplossless.decrypt.site/${storefront}/${id}`;
            ids.push(url);
            btn.parentElement.innerHTML += `<a href="${url}" target="_blank" class="downLinks">Download</a>`
        });

        document.querySelectorAll('div.cloud-button-container').forEach(e => {
            e.innerHTML = `<a class="downAllLinks" href="#">Copy download links to clipboard&nbsp;</a>` + e.innerHTML;
        });

        document.querySelectorAll('a.downAllLinks').forEach(e => e.addEventListener('click', function() {
            navigator.clipboard.writeText(ids.join("\n")).then(function() {
                alert('content copied');
            }, function() {
                alert('copy failed');
            });
        }));
    }).observe(document, {
        childList: true,
        subtree: true
    });
})();