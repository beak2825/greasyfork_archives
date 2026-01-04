// ==UserScript==
// @name         VK.com Image Unblur
// @namespace    https://github.com/goawaylovestrike
// @version      2.3
// @description  Remove blur effects from thumbnails on vk.com
// @author       GoAwayLoveStrike
// @icon         https://raw.githubusercontent.com/goawaylovestrike/Userscripts/refs/heads/main/vk-image-unblur/vk-image-unblur.png
// @match        https://vk.com/*
// @match        https://vkvideo.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547308/VKcom%20Image%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/547308/VKcom%20Image%20Unblur.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unblurContent() {
        // Remove blur from videoplayers
        document.querySelectorAll('.videoplayer').forEach(player => {
            player.className = player.className.replace('videoplayer--blur', '').trim();
        });

        // Remove age restriction elements
        document.querySelectorAll('.VideoRestriction__icon, .VideoRestriction__title, .VideoRestriction__text').forEach(el => el.remove());

        // Replace Watch with play button
        document.querySelectorAll('.VideoRestriction__button').forEach(button => {
            if (button.textContent === 'Watch') button.textContent = '▶';
        });

        // Remove blur from images
        document.querySelectorAll('img[class*="imgBlurred"]').forEach(img => {
            img.className = img.className.replace(/imgBlurred[^ ]*/g, '').trim();
        });

        // Remove hide icons
        document.querySelectorAll('svg.vkuiIcon--hide_outline_24, g path[d*="M0 0h28v28H0z"]').forEach(el => {
            el.closest('svg, g')?.remove();
        });
    }

    // Run immediately and watch for changes
    unblurContent();
    new MutationObserver(unblurContent).observe(document.body, { childList: true, subtree: true });
})();

