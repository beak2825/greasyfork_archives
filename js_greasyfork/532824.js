// ==UserScript==
// @name         Discord - Cacher images + prévisualisations de liens
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Cache toutes les images et les previews de liens sur Discord web
// @author       Mathis
// @match        https://discord.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532824/Discord%20-%20Cacher%20images%20%2B%20pr%C3%A9visualisations%20de%20liens.user.js
// @updateURL https://update.greasyfork.org/scripts/532824/Discord%20-%20Cacher%20images%20%2B%20pr%C3%A9visualisations%20de%20liens.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideStuff = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            img,
            video,
            .imageWrapper,
            .embedImage,
            .embedThumbnail,
            .embedVideo,
            .avatar-1BDn8e,
            .emoji,
            .wrapper-3t9DeA img,
            .attachment-1PZZB2 img,
            .image-3tDiHr,
            .mediaAttachmentsContainer-1WGRWy,
            .embed-IeVjo6,
            .richEmbedWrapper-1Ec7H6,
            .embedFull-1HGV2S,
            .embedWrapper-1MtIDg {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    };

    window.addEventListener('load', hideStuff);
})();