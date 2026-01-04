// ==UserScript==
// @name            Autoplayer
// @namespace       https://github.com/Bjufen
// @version         1.3
// @description     Autoplayer for iwatchsouthparkonline.cc
// @match           *://*.iwatchsouthparkonline.cc/episode/*
// @match           *://*.watchitsalwayssunnyinphiladelphia.cc/episode/*
// @match           *://*.watchfuturamaonline.com/episode/*
// @match           *://*.watchthevampirediaries.cc/episode/*
// @match           *://*.watchbrooklynnine-nine.com/episode/*
// @match           *://*.watchthementalistonline.cc/episode/*
// @match           *://*.watchsuitsonline.net/episode/*
// @match           *://*.watchtwoandahalfmenonline.cc/episode/*
// @match           *://*.watchrickandmortyonline.cc/episode/*
// @match           *://*.watchbonesonline.cc/episode/*
// @match           *://*.watchcharmedonline.cc/episode/*
// @match           *://*.watchcastleonline.cc/episode/*
// @match           *://*.watchparksandrecreation.cc/episode/*
// @match           *://*.watchdesperatehousewives.cc/episode/*
// @match           *://*.watchhowimetyourmother.cc/episode/*
// @match           *://*.iwatchtheoffice.cc/episode/*
// @match           *://*.watchmodernfamilyonline.com/episode/*
// @match           *://*.watchthebigbangtheory.cc/episode/*
// @match           *://*.watchfamilyguyonline.com/episode/*
// @match           *://*.iwatchfriends.cc/episode/*
// @match           *://*.watchhouseonline.cc/episode/*
// @match           *://*.watchcriminalminds.com/episode/*
// @match           *://*.watchdoctorwhoonline.cc/episode/*
// @match           *://*.watchprettylittleliarsonline.cc/episode/*
// @match           *://*.watchscrubsonline.cc/episode/*
// @match           *://*.watchthat70show.cc/episode/*
// @match           *://vidmoly.net/*
// @match           *://*vidmoly.*/*
// @match           *://*.vidmoly.net/*
// @match           *://*.vidmoly.*/*
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/546096/Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/546096/Autoplayer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const STORAGE_KEY_OFFSET = 'triggerOffset';
    const STORAGE_KEY_RANDOM = 'isRandomEnabled';
    const STORAGE_KEY_AUTOPLAY = 'isAutoPlayEnabled';

    const isInsideIframe = (window.self !== window.top);

    if (isInsideIframe) {

        const STORAGE_KEY_OFFSET = 'triggerOffset';
        let findVideoInterval = null;
        let videoPlayerElement = null;

        console.log('Autoplayer (Iframe): Script loaded. Announcing readiness to parent.');
        window.parent.postMessage('iframeReady', '*');

        const onVideoEnded = () => {
            console.log('Autoplayer (Iframe): Video ended in iframe. Sending message to parent page.');
            window.parent.postMessage('videoHasEnded', '*');
        };

        const setupVideoPlayer = (video) => {
            console.log('Autoplayer (Iframe): Video player found!', video);
            videoPlayerElement = video;

            let endMessageSent = false;
            console.log(`Autoplayer (Iframe): Trigger offset is ${GM_getValue(STORAGE_KEY_OFFSET, 0)}s.`);

            const onTimeUpdate = () => {
                if (GM_getValue(STORAGE_KEY_OFFSET, 0) <= 0) return;

                if (video.duration && !endMessageSent) {
                    if ((video.duration - video.currentTime) <= GM_getValue(STORAGE_KEY_OFFSET, 0)) {
                        endMessageSent = true;
                        console.log(`Autoplayer (Iframe): Triggering next episode ${GM_getValue(STORAGE_KEY_OFFSET, 0)}s before end.`);
                        window.parent.postMessage('videoHasEnded', '*');
                    }
                }
            };

            const onVideoEnded = () => {
                if (!endMessageSent) {
                    endMessageSent = true;
                    console.log('Autoplayer (Iframe): Video ended. Sending message to parent page.');
                    window.parent.postMessage('videoHasEnded', '*');
                }
            };

            videoPlayerElement.addEventListener('timeupdate', onTimeUpdate);
            videoPlayerElement.addEventListener('ended', onVideoEnded);
            console.log('Autoplayer (Iframe): Event listeners for timeupdate and ended attached.');

            try {
                console.log('Autoplayer (Iframe): Attempting to start video playback');
                video.play();

                const shouldRestoreFullscreen = GM_getValue('wasFullscreen', false);
                if (shouldRestoreFullscreen) {
                    console.log('Autoplayer (Iframe): Attempting to restore fullscreen mode.');
                    const fullscreenTarget = video.closest('.jwplayer') || video;

                    fullscreenTarget.requestFullscreen()
                        .then(() => {
                            console.log('Autoplayer (Iframe): Fullscreen mode entered successfully.');
                        })
                        .catch(err => {
                            console.error(`Autoplayer (Iframe): Fullscreen request was denied. Reason: ${err.message}`);
                        });
                }
                GM_setValue('wasFullscreen', false);
            } catch (e) {
                console.error('Autoplayer (Iframe): Error starting the video:', e);
            }
        };

        const startVideoSearch = () => {
            if (findVideoInterval) return;

            console.log('Autoplayer (Iframe): Starting video search...');
            findVideoInterval = setInterval(() => {
                const video = document.querySelector('video.jw-video');
                if (video) {
                    setupVideoPlayer(video);
                    clearInterval(findVideoInterval);
                    findVideoInterval = null;
                }
            }, 1000);
        };

        const stopVideoSearch = () => {
            if (findVideoInterval) {
                clearInterval(findVideoInterval);
                findVideoInterval = null;
                console.log('Autoplayer (Iframe): Stopped searching for video.');
            }
            if (videoPlayerElement) {
                videoPlayerElement.removeEventListener('ended', onVideoEnded);
                videoPlayerElement = null;
                console.log('Autoplayer (Iframe): Event listener removed.');
            }
        };

        window.addEventListener('message', (event) => {
            console.log('Autoplayer (Iframe): received command:', event.data, 'from main page');
            if (event.data === 'startAutoplay') {
                startVideoSearch();
            } else if (event.data === 'stopAutoplay') {
                stopVideoSearch();
            }
        });

    } else {

        let isRandomEnabled = GM_getValue(STORAGE_KEY_RANDOM, false);
        let isAutoPlayEnabled = GM_getValue(STORAGE_KEY_AUTOPLAY, true);
        let iframeIsReady = false;
        const offsetLabel = '⏰ Set Trigger Offset...';

        const sendCommandToIframe = (command) => {
            const iframe = document.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                console.log('Autoplayer (Main): sending command:', command, 'to Iframe');
                iframe.contentWindow.postMessage(command, '*');
            } else {
                console.error('Autoplayer (Main): Could not find the iframe to send command');
            }
        };

        const setTriggerOffset = () => {
            const currentOffset = GM_getValue(STORAGE_KEY_OFFSET, 0);
            const newOffsetInput = prompt(
                'Enter seconds before video end to trigger next episode. Use 0 to trigger at the very end.',
                currentOffset
            );

            if (newOffsetInput !== null) {
                const newOffset = parseInt(newOffsetInput, 10);
                if (!isNaN(newOffset) && newOffset >= 0) {
                    GM_setValue(STORAGE_KEY_OFFSET, newOffset);
                    console.log(`Autoplayer (Main): Trigger offset saved as ${newOffset}s.`);
                } else {
                    alert('Invalid input. Please enter a positive number or 0.');
                }
            }
        };
        const updateAllMenuCommands = (firstRun = false) => {
            if (!firstRun) {
                GM_unregisterMenuCommand('✅ Autoplay Enabled');
                GM_unregisterMenuCommand('❌ Autoplay Disabled');
                GM_unregisterMenuCommand('▶️ Next Episode');
                GM_unregisterMenuCommand('🔀 Random Episode');
                GM_unregisterMenuCommand(offsetLabel);
            }

            const autoPlayLabel = isAutoPlayEnabled ? '✅ Autoplay Enabled' : '❌ Autoplay Disabled';
            GM_registerMenuCommand(autoPlayLabel, toggleAutoPlayState);

            const randomLabel = isRandomEnabled ? '🔀 Random Episode' : '▶️ Next Episode';
            GM_registerMenuCommand(randomLabel, toggleRandomState);

            GM_registerMenuCommand(offsetLabel, setTriggerOffset);
        };

        const toggleRandomState = () => {
            isRandomEnabled = !isRandomEnabled;
            GM_setValue(STORAGE_KEY_RANDOM, isRandomEnabled)
            updateAllMenuCommands();
        };

        const toggleAutoPlayState = () => {
            isAutoPlayEnabled = !isAutoPlayEnabled;
            GM_setValue(STORAGE_KEY_AUTOPLAY, isAutoPlayEnabled);
            updateAllMenuCommands();
            if (isAutoPlayEnabled) {
                sendCommandToIframe('startAutoplay');
            } else {
                sendCommandToIframe('stopAutoplay');
            }
        };

        window.addEventListener('message', (event) => {
            if (event.data === 'iframeReady') {
                console.log('Autoplayer (Main): Received "iframeReady" message.');
                iframeIsReady = true;
                if (isAutoPlayEnabled) {
                    sendCommandToIframe('startAutoplay');
                }
            } else if (event.data === 'videoHasEnded') {
                handleVideoEnd();
            }
        });

        const handleVideoEnd = () => {
            console.log('Autoplayer (Main): Received "videoHasEnded" message from iframe.');
            if (!isAutoPlayEnabled) {
                console.log('Autoplayer (Main): Autoplay is disabled, not proceeding.');
                return;
            }

            const wasFullscreen = !!document.fullscreenElement;
            console.log(`Autoplayer (Main): Was in fullscreen mode? ${wasFullscreen}`);
            GM_setValue('wasFullscreen', wasFullscreen);

            if (isRandomEnabled) {
                try {
                    const randomButton = document.querySelector('a.random_ep');
                    if (randomButton) {
                        console.log('Autoplayer (Main): Found random button on main page. Clicking it.');
                        randomButton.click();
                    } else {
                        console.error('Autoplayer (Main): Could not find random button episode on main page');
                    }
                } catch (e) {
                    console.error('Autoplayer (Main): Failure in random episode selection', e);
                }
            } else {
                try {
                    const nextButton = document.querySelector('a .dashicons-controls-forward');
                    if (nextButton) {
                        console.log('Autoplayer (Main): Found active "Next" button, clicking it.');
                        nextButton.closest('a').click();
                        return;
                    }

                    console.log('Autoplayer (Main): "Next" button is disabled. Checking for next season.');
                    const currentSeasonLi = document.querySelector('li#season-temp-on');
                    if (!currentSeasonLi) {
                        console.error('Autoplayer (Main): Could not determine the current season.');
                        return;
                    }

                    const nextSeasonLi = currentSeasonLi.nextElementSibling;

                    if (nextSeasonLi) {
                        const nextSeasonNumber = nextSeasonLi.querySelector('a').dataset.season;

                        const pathParts = window.location.pathname.split('/').filter(part => part);
                        const episodeSlug = pathParts[1];
                        const lastHyphenIndex = episodeSlug.lastIndexOf('-');
                        const showName = episodeSlug.substring(0, lastHyphenIndex);

                        const nextEpisodeUrl = `/episode/${showName}-${nextSeasonNumber}x1/`;
                        console.log(`Autoplayer (Main): Navigating to next season's first episode: ${nextEpisodeUrl}`);
                        window.location.href = nextEpisodeUrl;
                    } else {
                        console.log('Autoplayer (Main): End of series detected.');
                        alert('Congratulations, you have finished the entire series!');
                    }
                } catch (e) {
                    console.error('Autoplayer (Main): Failure in next episode selection', e);
                }
            }

        };

        updateAllMenuCommands(true);
    }
})();