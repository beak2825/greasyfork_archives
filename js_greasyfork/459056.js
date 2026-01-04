// ==UserScript==
// @name            AMQ Dynamic Background
// @namespace       https://github.com/SlashNephy
// @version         0.3.1
// @author          SlashNephy
// @description     Set the currently playing video surface as the background image.
// @description:ja  現在再生中の動画を背景画像に設定します。
// @homepage        https://scrapbox.io/slashnephy/AMQ_%E3%81%AE%E8%83%8C%E6%99%AF%E3%81%AB%E5%8B%95%E7%94%BB%E3%82%92%E6%B5%81%E3%81%99_UserScript
// @homepageURL     https://scrapbox.io/slashnephy/AMQ_%E3%81%AE%E8%83%8C%E6%99%AF%E3%81%AB%E5%8B%95%E7%94%BB%E3%82%92%E6%B5%81%E3%81%99_UserScript
// @icon            https://animemusicquiz.com/favicon-32x32.png
// @supportURL      https://github.com/SlashNephy/userscripts/issues
// @match           https://animemusicquiz.com/*
// @require         https://cdn.jsdelivr.net/gh/TheJoseph98/AMQ-Scripts@b97377730c4e8553d2dcdda7fba00f6e83d5a18a/common/amqScriptInfo.js
// @grant           unsafeWindow
// @license         MIT license
// @downloadURL https://update.greasyfork.org/scripts/459056/AMQ%20Dynamic%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/459056/AMQ%20Dynamic%20Background.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const awaitFor = async (predicate, timeout) => new Promise((resolve, reject) => {
        let timer;
        const interval = window.setInterval(() => {
            if (predicate()) {
                clearInterval(interval);
                clearTimeout(timer);
                resolve();
            }
        }, 500);
    });

    const onReady = (callback) => {
        if (document.getElementById('startPage')) {
            return;
        }
        awaitFor(() => document.getElementById('loadingScreen')?.classList.contains('hidden') === true)
            .then(callback)
            .catch(console.error);
    };

    onReady(() => {
        const video = document.createElement('video');
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.muted = true;
        video.loop = true;
        const container = document.getElementById('quizPage') ?? document.body;
        container.insertAdjacentElement('afterbegin', video);
        new Listener('answer results', () => {
            const quizPlayer = quizVideoController.getCurrentPlayer();
            if (!quizPlayer) {
                return;
            }
            if (quizPlayer.resolution === 0) {
                return;
            }
            const quizVideo = quizPlayer.$player[0];
            if (quizVideo && video.src !== quizVideo.src) {
                video.src = quizVideo.src;
                video.currentTime = quizVideo.currentTime;
                void video.play();
            }
        }).bindListener();
        AMQ_addScriptData({
            name: 'Dynamic Background',
            author: 'SlashNephy &lt;spica@starry.blue&gt;',
            description: 'Set the currently playing video surface as the background image.',
        });
    });

})();
