// ==UserScript==
// @name         Bilibili 自动切P
// @namespace    https://github.com/Tsuk1ko
// @version      1.0.6
// @description  为什么要单独写个脚本呢？因为自动连播就是个傻逼……
// @author       神代綺凛
// @license      GPL-3.0
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/432283/Bilibili%20%E8%87%AA%E5%8A%A8%E5%88%87P.user.js
// @updateURL https://update.greasyfork.org/scripts/432283/Bilibili%20%E8%87%AA%E5%8A%A8%E5%88%87P.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const log = (...args) => console.log('[BilibiliAutoNext]', ...args);

    const playerVideoEndedEvents = ['video_media_ended', 'MEDIA_ENDED'];
    const playerDestroyEvents = ['video_destroy'];

    const win = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

    const get = (obj, paths) => paths.reduce((prev, path) => (typeof prev === 'undefined' ? undefined : prev[path]), obj);

    const initPlayer = () => {
        const { player } = win;
        if (!player) return;
        playerVideoEndedEvents.forEach(event => {
            player.on(event, onVideoEnded);
        });
        playerDestroyEvents.forEach(event => {
            player.on(event, () => setTimeout(initPlayer));
        });
        log('initialized successfully');
    };

    const onVideoEnded = () => {
        const curP = get(win, ['__INITIAL_STATE__', 'p']);
        const totalP = get(win, ['__INITIAL_STATE__', 'videoData', 'videos']);
        log(`video ended ${curP}/${totalP}`);
        if (curP < totalP) {
            log('goto next video');
            setTimeout(() => player.next(), 100);
        }
    };

    Object.defineProperty(win, 'player', {
        configurable: true,
        set: player => {
            delete win.player;
            win.player = player;
            initPlayer();
        },
    });
})();
