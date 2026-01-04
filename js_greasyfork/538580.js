// ==UserScript==
// @name         Nexus Mods Gallery Preview Hover (Universal)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Show thumbgallery preview images when hovering on a NexusMods main mod link or mod thumbnail, works for any game. Preview popup is fixed near the anchor, mouse can interact with popup.
// @author       GPT
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      nexusmods.com
// @downloadURL https://update.greasyfork.org/scripts/538580/Nexus%20Mods%20Gallery%20Preview%20Hover%20%28Universal%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538580/Nexus%20Mods%20Gallery%20Preview%20Hover%20%28Universal%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let previewDiv = null;
    let previewTimer = null;
    let currentLink = null;
    let hoverOnPreview = false;
    let hoverOnLink = false;

    // Only match main mod links (mods/<number>), for any game on NexusMods
    function isModMainLink(href) {
        // e.g. https://www.nexusmods.com/skyrimspecialedition/mods/12345
        //      https://www.nexusmods.com/fallout4/mods/6789
        return /^https?:\/\/(www\.)?nexusmods\.com\/[^\/]+\/mods\/\d+$/.test(href);
    }

    // Create the preview popup near the anchor (link or image)
    function createPreview(images, anchor) {
        removePreview();
        previewDiv = document.createElement('div');
        previewDiv.style.position = 'absolute';
        previewDiv.style.zIndex = 99999;
        previewDiv.style.background = '#222';
        previewDiv.style.padding = '8px';
        previewDiv.style.borderRadius = '8px';
        previewDiv.style.boxShadow = '0 2px 12px rgba(0,0,0,0.35)';
        previewDiv.style.maxWidth = '560px';
        previewDiv.style.maxHeight = '420px';
        previewDiv.style.overflowY = 'auto';
        previewDiv.style.overflowX = 'hidden';
        previewDiv.style.display = 'grid';
        previewDiv.style.gridTemplateColumns = '1fr 1fr';
        previewDiv.style.gap = '8px';

        // Add all images to the popup grid
        for (let img of images) {
            let i = document.createElement('img');
            i.src = img;
            i.style.maxHeight = '180px';
            i.style.maxWidth = '260px';
            i.style.width = '100%';
            i.style.objectFit = 'cover';
            i.style.borderRadius = '4px';
            previewDiv.appendChild(i);
        }

        document.body.appendChild(previewDiv);

        // Position the preview below and slightly to the right of the anchor
        let rect = anchor.getBoundingClientRect();
        let scrollX = window.scrollX || document.documentElement.scrollLeft;
        let scrollY = window.scrollY || document.documentElement.scrollTop;
        let left = rect.left + scrollX + 8;
        let top = rect.bottom + scrollY + 6;
        previewDiv.style.left = left + 'px';
        previewDiv.style.top = top + 'px';

        // When mouse enters/leaves the popup
        previewDiv.addEventListener('mouseenter', function() {
            hoverOnPreview = true;
            clearTimeout(previewTimer);
        });
        previewDiv.addEventListener('mouseleave', function() {
            hoverOnPreview = false;
            startPreviewTimeout();
        });
    }

    // Start delayed removal of preview
    function startPreviewTimeout() {
        previewTimer = setTimeout(() => { removePreview(); }, 200);
    }

    // Remove the preview popup
    function removePreview() {
        if (previewDiv && previewDiv.parentNode) {
            previewDiv.parentNode.removeChild(previewDiv);
            previewDiv = null;
        }
        currentLink = null;
        clearTimeout(previewTimer);
        hoverOnPreview = false;
        hoverOnLink = false;
    }

    // Fetch thumbgallery images from the mod page
    function fetchGallery(link, anchor) {
        if (currentLink === link) return; // Prevent duplicate requests
        currentLink = link;
        GM_xmlhttpRequest({
            method: 'GET',
            url: link,
            onload: function(response) {
                let html = response.responseText;
                let match = html.match(/<ul class="thumbgallery gallery clearfix"[^>]*>([\s\S]*?)<\/ul>/);
                if (match) {
                    let ul = match[1];
                    let imgRegex = /<img\s+[^>]*src="([^"]+)"[^>]*>/g;
                    let images = [];
                    let m;
                    while ((m = imgRegex.exec(ul)) !== null) {
                        images.push(m[1]);
                    }
                    if (images.length > 0) {
                        createPreview(images, anchor);
                    }
                }
            }
        });
    }

    // Listen for mouseover on mod main links
    document.body.addEventListener('mouseover', function(e) {
        let target = e.target;
        if (target.tagName === 'A' && isModMainLink(target.href)) {
            hoverOnLink = true;
            fetchGallery(target.href, target);
            target.addEventListener('mouseleave', function handler() {
                hoverOnLink = false;
                startPreviewTimeout();
                target.removeEventListener('mouseleave', handler);
            });
        }
    }, true);

    // Listen for mouseover on mod thumbnails (img inside mod main link)
    document.body.addEventListener('mouseover', function(e) {
        let target = e.target;
        // Typical thumbnails are <img> inside <a>
        if (
            target.tagName === 'IMG'
            && target.closest('a')
            && isModMainLink(target.closest('a').href)
        ) {
            let a = target.closest('a');
            hoverOnLink = true;
            fetchGallery(a.href, target);
            a.addEventListener('mouseleave', function handler() {
                hoverOnLink = false;
                startPreviewTimeout();
                a.removeEventListener('mouseleave', handler);
            });
        }
    }, true);

    // Remove preview when clicking elsewhere on the page
    document.addEventListener('mousedown', function(e) {
        if (previewDiv && !previewDiv.contains(e.target)) {
            removePreview();
        }
    });

})();
