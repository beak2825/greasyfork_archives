// ==UserScript==
// @name            MoonWalk Assistant
// @name:en         MoonWalk Assistant
// @namespace       ANT0x1
// @version         2.5.2
// @date            2018-12-02
// @description     Убирает рекламу из онлайн плееров.
// @description:en  Removes ads from online players.
// @author          ANT0x1
// @match           http://*.abbanole.com/*/iframe*
// @match           http://*.mastarti.com/*/iframe*
// @icon            http://hdrezka.me/templates/hdrezka/images/favicon.ico
// @supportURL      http://clc.am/RemoveAds
// @run-at          document-end
// @homepage        http://clc.am/zWStKw
// @grant           none
// @copyright       2018, ANT0x1
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @namespace       ANT0x1
// @downloadURL https://update.greasyfork.org/scripts/370997/MoonWalk%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/370997/MoonWalk%20Assistant.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author          ANT0x1
// ==/OpenUserJS==

(function () {
    'use strict';
    setTimeout(removeAds, 2000);
})();

var currentVideo = {
    position: 0,
    isFinished: false,
    volume: 100
};

function removeAds() {
    if (typeof video_balancer !== 'undefined') {
        console.log('[Assistant] Removin Ads');

        video_balancer.adv_loader.options.adb_vast.urls = [];
        video_balancer.adv_loader.options.vast.urls = [];
        video_balancer.adv_loader.options.reserve_vast.urls = [];
    }

    console.log("[Assistant] Ads disabled.");
    playVideo();
}

function playVideo() {
    setTimeout(function () {
        if (typeof player === 'undefined' || typeof player.api === 'undefined') {
            playVideo();
            return;
        }

        console.log("[Assistant] Playing.");

        setTimeout(function () {
            setTimeout(restoreFromStorage, 2000);
            player.api.setVolume(currentVideo.volume);
            autoSave();
        }, 2000);
    }, 2000);
}

function autoSave() {
    var timeout = api.paused ? 20000 : 5000;

    setTimeout(function () {
        savePosition();

        if (!api.paused)
            saveToStorage();

        if (!currentVideo.isFinished)
            autoSave();

    }, timeout);
}

function savePosition() {
    currentVideo.position = _mw_current_time;
    currentVideo.volume = api.volumeLevel;
    currentVideo.isFinished = api.finished;
}

function restorePosition() {

    if (currentVideo.position > 0) {
        player.api.seek(currentVideo.position);
        console.log("[Assistant] Position restored to " + currentVideo.position + ' sec.');
    }
}

function saveToStorage() {
    var videos = JSON.parse(localStorage.getItem('videos'));

    if (!videos)
        videos = {};

    videos[video_balancer.options.video_token] = currentVideo;
    localStorage.setItem('videos', JSON.stringify(videos));

    //console.log('[Assistant] Saved to storage');
}

function restoreFromStorage() {
    var videos = JSON.parse(localStorage.getItem('videos'));

    if (!videos) {
        videos = {};
    }

    currentVideo = videos[video_balancer.options.video_token];

    if (!currentVideo) {
        currentVideo = {
            position: 0,
            isFinished: false,
            volume: api.volumeLevel
        };
    }

    console.log('[Assistant] Restored from storage');

    if (!currentVideo.isFinished)
        restorePosition();
    else
        currentVideo.isFinished = false;
}
