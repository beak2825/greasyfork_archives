// ==UserScript==
// @name         Remove Voxlis Ads
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Remove promotional ads from Voxlis.net
// @author       Teemsploit
// @match        https://voxlis.net/*
// @grant        none
// @license unlicense
// @downloadURL https://update.greasyfork.org/scripts/535674/Remove%20Voxlis%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/535674/Remove%20Voxlis%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeAds() {
        document.querySelectorAll('.promo-header').forEach(header => {
            const wrapper = header.closest('div');
            const body = wrapper?.nextElementSibling;
            if (body && body.classList.contains('promo-body')) {
                wrapper.remove();
                body.remove();
            } else {
                wrapper.remove();
            }
        });
        document.querySelectorAll('.promo-image').forEach(imgDiv => {
            if (imgDiv.querySelector('img[src*="Affiliate_Banner.png"]')) {
                imgDiv.remove();
            }
        });
        document.querySelectorAll('.ad-cntnt').forEach(el => el.remove());
        document.querySelectorAll('.banner-content').forEach(banner => banner.remove());
        document.querySelectorAll('.ad-hdr').forEach(hdr => {
            const next = hdr.nextElementSibling;
            hdr.remove();
            if (next && (next.classList.contains('promo-body') || next.classList.contains('ad-body') || next.classList.contains('ad-bdy'))) {
                next.remove();
            }
        });
        document.querySelectorAll('.ad-bdy').forEach(el => el.remove());
        document.querySelectorAll('.ad-spnsr, .promo-sponsor').forEach(span => span.remove());
    }
    window.addEventListener('load', removeAds);
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
