// ==UserScript==
// @name        PlayerFM PWA
// @namespace   net.englard.shmuelie
// @version     1.3.4
// @description Enables PWA features in PlayerFM web.
// @author      Shmuelie
// @match       https://player.fm/*
// @grant       none
// @website     https://github.com/shmuelie/user-scripts/blob/main/src/PlayerFMPWA.user.js
// @supportURL  https://github.com/shmuelie/user-scripts/issues
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428464/PlayerFM%20PWA.user.js
// @updateURL https://update.greasyfork.org/scripts/428464/PlayerFM%20PWA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.player && navigator.mediaSession) {
        const p = window.player;
        const ms = navigator.mediaSession;

        function onPlay() {
            ms.playbackState = "playing";
            ms.metadata = new MediaMetadata({
                album: p.currentEpisode.series.title,
                artist: p.currentEpisode.series.network.name || p.currentEpisode.series.owner,
                artwork: [
                    {
                        src: p.currentEpisode.series.imageModel.url
                    }
                ],
                title: p.currentEpisode.title
            });
            document.title = "PlayerFM: " + p.currentEpisode.series.title + " - " + p.currentEpisode.title;
        }

        function onPause() {
            ms.playbackState = "paused";
        }

        function onEnded() {
            ms.playbackState = "none";
        }

        function onTimeupdate() {
            if (ms.setPositionState) {
                ms.setPositionState({
                    duration: p.getDuration(),
                    position: p.getCurrentTime(),
                    playbackRate: p.getSpeed()
                });
            }
            updatePlaylist();
        }

        function onSeekForward() {
            p.seekIncrement(p.getForwardJumpDuration());
        }

        function onSeekBackward() {
            p.seekIncrement(-p.getBackwardJumpDuration());
        }

        function onNextTrack() {
            p.gotoNext(false);
        }

        function onPreviousTrack() {
            p.gotoPrev();
        }

        function updatePlaylist() {
            if (p.currentPlaylist) {
                if (p.currentPlaylist.index > 0) {
                    ms.setActionHandler("previoustrack", onPreviousTrack);
                } else {
                    ms.setActionHandler("previoustrack", null);
                }
                if (p.currentPlaylist.index < p.currentPlaylist.length() - 1) {
                    ms.setActionHandler("nexttrack", onNextTrack);
                } else {
                    ms.setActionHandler("nexttrack", null);
                }
            } else {
                ms.setActionHandler("nexttrack", null);
                ms.setActionHandler("previoustrack", null);
            }
        }

        p.listen("play", onPlay);
        p.listen("pause", onPause);
        p.listen("ended", onEnded);
        p.listen("timeupdate", onTimeupdate);
        p.listen("playing", onPlay);

        ms.setActionHandler("pause", function () {
            p.togglePlayback(false);
        });
        ms.setActionHandler("play", function() {
            p.togglePlayback(true);
        });
        ms.setActionHandler("seekforward", onSeekForward);
        ms.setActionHandler("seekbackward", onSeekBackward);
        updatePlaylist();
    }
})();