// ==UserScript==
// @name         Bypass YouTube Account-Based Restrictions
// @namespace    https://greasyfork.org
// @version      0.0.6
// @description  This scripts will not restore your account from a restricted status!
// @author       Pixmi
// @homepage     https://github.com/Pixmi/bypass-youtube-account-based-restrictions
// @supportURL   https://github.com/Pixmi/bypass-youtube-account-based-restrictions/issues
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      GPL-3.0
// @grant        none
// @compatible   Chrome
// @compatible   Firefox
// @downloadURL https://update.greasyfork.org/scripts/505393/Bypass%20YouTube%20Account-Based%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/505393/Bypass%20YouTube%20Account-Based%20Restrictions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = location.href;

    const observeUrlChange = async () => {
        if (location.href === lastUrl) return;
        lastUrl = location.href;
        // console.log('URL changed to:', lastUrl);
        await replacePlayer(lastUrl);
    };

    const titleNode = document.querySelector('title');
    if (titleNode) {
        new MutationObserver(observeUrlChange).observe(titleNode, { childList: true });
    }

    const progressNode = document.querySelector('yt-page-navigation-progress');
    if (progressNode) {
        new MutationObserver(observeUrlChange).observe(progressNode, { attributes: true });
    }

    async function replacePlayer(url) {
        const match = url.match(/(?<type>watch|live|shorts)(?:\?v=|\/)(?<id>.{11})/) || false;
        if (!match) {
            document.body.querySelector('iframe.embed-frame')?.setAttribute('src', '');
            return false;
        }
        const attributes = {
            src: `https://www.youtube.com/embed/${match.groups.id}?autoplay=0&modestbranding=1`,
            title: 'YouTube video player',
            class: 'embed-frame',
            frameborder: 0,
            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            referrerpolicy: 'strict-origin-when-cross-origin',
            allowfullscreen: ''
        }
        if (/m\.youtube/.test(url)) {
            attributes.id = 'movie_player';
            attributes.class += ' html5-video-player';
            document.querySelector('#player-container-id #player')?.setAttribute('playable', 'true');
        } else {
            attributes.id = match.groups.type == 'shorts' ? 'shorts-player' : 'ytd-player';
            attributes.style = 'width:100%;height:100%;visibility:visible!important;';
            document.querySelector('yt-playability-error-supported-renderers')?.setAttribute('style', 'display:none;');
        }
        const player = document.querySelector(`#${attributes.id}`);
        if (player.src === attributes.src) return false;
        const frame = document.createElement('iframe');
        for (const key of Object.keys(attributes)) frame.setAttribute(key, attributes[key]);
        player.replaceWith(frame);
    }

    setTimeout(async () => await replacePlayer(lastUrl), 2000);

    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible') {
            await replacePlayer(lastUrl)
        }
    });
})();