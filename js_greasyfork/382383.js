/**
BSD 2-Clause License

Copyright (c) 2019, kiranmurmuone
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

**/

// ==UserScript==
// @name            Stop Button for YouTube
// @namespace       io.github.kiranmurmuone.user-script.stop-button-for-youtube
// @version         1.2.4
// @description     A custom 'Stop Button' for YouTube video player, This allows you to end video (ad) or stop live stream by simply clicking on it.
// @author          kiranmurmuone
// @copyright       2019, kiranmurmuone
// @match           *://www.youtube.com/*
// @source          https://github.com/kiranmurmuone/stop-button-for-youtube
// @homepageURL     https://kiranmurmuone.github.io/stop-button-for-youtube
// @license         BSD 2-Clause
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/382383/Stop%20Button%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/382383/Stop%20Button%20for%20YouTube.meta.js
// ==/UserScript==

var _ytp_thread_handler = 0;
var _ytp_thread_interval = 250;
var _ytp_thread_stopped = false;
var _ytp_player_main_control = null;
var _ytp_player_main_video = null;
var _ytp_player_stop_button = null;
var _ytp_player_create_button = null;
var _ytp_player_left_control = null;

const _ytp_selector = {
    watch: 'ytd-player.style-scope.ytd-watch-flexy',
    channel: 'ytd-player.style-scope.ytd-channel-video-player-renderer',
    main_control: 'div#movie_player',
    main_video: 'video.video-stream.html5-main-video',
    hide_control: 'ytp-hide-controls',
    stop_button: 'button.ytp-stop-button.ytp-button',
    player_control: 'div.ytp-left-controls'
};

const _ytp_button_property = {
    class_value: 'ytp-stop-button ytp-button',
    title_value: 'Stop or skip video',
    label_value: 'Stop or skip video',
    html5_value: '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-91">' +
    '</use><path class="ytp-svg-fill" d="M 12,12 v 12 h 12 V 12 h -2 z M 12,12 v 12 h 12 V 12 h -2 z" id="ytp-id-91"></path></svg>'
};

function _ytp_player_main_thread() {
    if (_ytp_button_create(_ytp_selector.watch) || _ytp_button_create(_ytp_selector.channel)) {
        console.log("ytp-create-control-button: 'button-name: ytp-stop-button', status: 201 Created");
    }
    _ytp_thread_stopped = true;
    _ytp_thread_handler = 0;
}

function _ytp_player_stop_video(_ytd_player_element) {
    _ytp_player_main_video = document.querySelector(_ytd_player_element + ' ' + _ytp_selector.main_video);
    if (typeof _ytp_player_main_video !== 'undefined' && _ytp_player_main_video) {
        _ytp_player_main_control = document.querySelector(_ytd_player_element + ' ' + _ytp_selector.main_control);
        if (typeof _ytp_player_main_control !== 'undefined' && _ytp_player_main_control) {
            if (_ytp_player_main_control.isAtLiveHead()) {
                _ytp_player_main_control.stopVideo();
                _ytp_player_main_control.classList.remove(_ytp_selector.hide_control);
                console.log("ytp-main-video-player: 'mode-name: ytp-unstarted-mode', status: 200 Ok");
            } else {
                _ytp_player_main_video.currentTime = _ytp_player_main_video.getDuration();
                _ytp_player_main_video.ended = true;
                _ytp_player_main_video.paused = true;
                console.log("ytp-main-video-player: 'mode-name: ytp-ended-mode', status: 200 Ok");
            }
        } else {
            console.log("ytp-main-video-player: 'mode-name: ytp-unstarted-mode', status: 404 Not Found");
        }
    } else {
        console.log("ytp-main-video-player: 'mode-name: ytp-ended-mode', status: 404 Not Found");
    }
}

function _ytp_button_create(_ytd_player_element) {
    _ytp_player_stop_button = document.querySelector(_ytd_player_element + ' ' + _ytp_selector.stop_button);
    if (typeof _ytp_player_stop_button !== 'undefined' && !_ytp_player_stop_button) {
        _ytp_player_left_control = document.querySelector(_ytd_player_element + ' ' + _ytp_selector.player_control);
        if (typeof _ytp_player_left_control !== 'undefined' && _ytp_player_left_control) {
            _ytp_player_create_button = document.createElement('BUTTON');
            if (typeof _ytp_player_create_button !== 'undefined' && _ytp_player_create_button) {
                _ytp_player_create_button.setAttribute('class', _ytp_button_property.class_value);
                _ytp_player_create_button.setAttribute('title', _ytp_button_property.title_value);
                _ytp_player_create_button.setAttribute('aria-label', _ytp_button_property.label_value);
                _ytp_player_create_button.innerHTML = _ytp_button_property.html5_value;
                _ytp_player_create_button.addEventListener('click', function () { _ytp_player_stop_video(_ytd_player_element);});
                _ytp_player_left_control.insertBefore(_ytp_player_create_button, _ytp_player_left_control.childNodes[3]);
                _ytp_player_stop_button = document.querySelector(_ytd_player_element + ' ' + _ytp_selector.stop_button);
                if (typeof _ytp_player_stop_button !== 'undefined' && _ytp_player_stop_button) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

(function () {
    'use strict';
    if (!_ytp_thread_stopped) {
        _ytp_thread_handler = setInterval(_ytp_player_main_thread, _ytp_thread_interval);
    }
})();
