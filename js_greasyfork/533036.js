// ==UserScript==
// @name         DMMTVとDアニメストアのURLで再生位置を指定
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  DMMTVとDアニメストアでURLパラメータ t=秒数 で指定した位置から再生
// @match        https://tv.dmm.com/vod/playback/on-demand/*
// @match        https://animestore.docomo.ne.jp/animestore/sc_d_pc*
// @match        https://animestore.docomo.ne.jp/animestore/ci_pc?*
// @downloadURL https://update.greasyfork.org/scripts/533036/DMMTV%E3%81%A8D%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%81%AEURL%E3%81%A7%E5%86%8D%E7%94%9F%E4%BD%8D%E7%BD%AE%E3%82%92%E6%8C%87%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/533036/DMMTV%E3%81%A8D%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%E3%81%AEURL%E3%81%A7%E5%86%8D%E7%94%9F%E4%BD%8D%E7%BD%AE%E3%82%92%E6%8C%87%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const timeParam = urlParams.get('t');
    const currentDomain = window.location.hostname;
    const currentPath = window.location.pathname;

    if (!timeParam) {
        return;
    }

    let startTimeInSeconds = 0;
    const startFromTime = parseInt(timeParam, 10);
    if (!isNaN(startFromTime)) {
        startTimeInSeconds = startFromTime;
    } else {
        return;
    }

    if (currentDomain === 'tv.dmm.com') {
        applyTimeToDMM(startTimeInSeconds);
    } else if (currentDomain === 'animestore.docomo.ne.jp') {
        if (currentPath.includes('/animestore/sc_d_pc')) {
            applyTimeToDAnime(startTimeInSeconds);
        } else if (currentPath.includes('/animestore/ci_pc')) {
        }
    }

    // DMM TV向け再生位置設定関数
    function applyTimeToDMM(seconds) {
        const checkPlayerInterval = setInterval(() => {
            const videoPlayer = document.querySelector('video');
            if (videoPlayer) {
                clearInterval(checkPlayerInterval);

                videoPlayer.addEventListener('canplay', function onCanPlay() {
                    videoPlayer.removeEventListener('canplay', onCanPlay);
                    videoPlayer.currentTime = seconds;
                    videoPlayer.play();
                });

                if (videoPlayer.readyState >= 3) {
                    videoPlayer.currentTime = seconds;
                }
            }
        }, 500);
    }

    // Dアニメストア向け再生位置設定関数
    function applyTimeToDAnime(seconds) {
        let videoStarted = false;

        const checkPlayerInterval = setInterval(() => {
            let videoPlayer = document.querySelector('video');
            const playerIframe = document.querySelector('iframe#frame_video');

            if (playerIframe && !videoPlayer) {
                try {
                    videoPlayer = playerIframe.contentDocument.querySelector('video');
                } catch (e) {
                    playerIframe.contentWindow.postMessage({
                        action: 'setVideoTime',
                        time: seconds,
                        afterPlay: true
                    }, '*');
                }
            }

            if (videoPlayer) {
                clearInterval(checkPlayerInterval);

                videoPlayer.addEventListener('playing', function onPlaying() {
                    if (videoStarted) return;
                    videoStarted = true;

                    setTimeout(() => {
                        videoPlayer.currentTime = seconds;
                    }, 100);

                    videoPlayer.removeEventListener('playing', onPlaying);
                });
            }
        }, 50);

        window.addEventListener('message', function(event) {
            if (event.data && event.data.action === 'videoReady') {
                event.source.postMessage({
                    action: 'setVideoTime',
                    time: seconds,
                    afterPlay: true
                }, '*');
            }

            if (event.data && event.data.action === 'videoPlaying') {
                setTimeout(() => {
                    event.source.postMessage({
                        action: 'setVideoTime',
                        time: seconds
                    }, '*');

                }, 100);
            }
        });
    }
})();