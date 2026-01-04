// ==UserScript==
// @name       Bili-Youtube-Player-Hotkey
// @description B站和油管播放器快捷键
// @version  0.1
// @match    https://www.bilibili.com/*
// @match    https://www.youtube.com/*
// @require    https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @license MIT
// @namespace https://greasyfork.org/users/1232695
// @downloadURL https://update.greasyfork.org/scripts/482018/Bili-Youtube-Player-Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/482018/Bili-Youtube-Player-Hotkey.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // *********************************************************************************
    // Functions
    function poll_for_element(selector, callback = undefined, interval = 250, timeout = 5000) {
        const startTime = Date.now();
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                if (typeof callback === "function") {
                    callback(element);
                } else {
                    return element;
                }
            } else if (Date.now() - startTime < timeout) {
                setTimeout(checkElement, interval);
            } else {
                console.warn(`Timeout reached while polling for element with selector "${selector}"`);
            }
        };
        return checkElement();
    }

    const dlog = (message, fontSize = "1.25em") => {
        const styles = [
            `font-weight: bold`,
            `font-size: ${fontSize || '16px'}`,
            `color: brown`,
        ];
        message = 'user-dlog: ' + message;
        console.log(`%c${message}`, styles.join(';'));
    }

    // *********************************************************************************
    // Main Logic
    // If video not found, exit early
    const { host } = location;
    // const vobj = document.querySelector('video');
    const vobj = poll_for_element('video');

    if (!vobj) {
        console.warn('Video element not found. Exiting script.');
        return;
    }
    dlog('Script Loaded.')

    // Fullscreen toggle
    let is_full = false;
    const enterFullscreenFunc = vobj.requestFullscreen || vobj.mozRequestFullScreen || vobj.webkitRequestFullscreen || vobj.msRequestFullscreen;
    const exitFullscreenFunc = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
    const toggle_fs = () => {
        is_full ? exitFullscreenFunc.call(document) : enterFullscreenFunc.call(vobj);
        is_full = !is_full;
    };

    // Constants for control steps
    const play_rate_step = 0.25;
    const volume_step = 0.1;
    const forward_step = 3;

    // Control actions dictionary
    let controls = {
        'Enter': toggle_fs,
        'Shift+ArrowUp': () => vobj.playbackRate += play_rate_step,
        'Shift+ArrowDown': () => vobj.playbackRate -= play_rate_step,
        'Shift+Z': () => vobj.playbackRate = 1,
        'Space': () => vobj.paused ? vobj.play() : vobj.pause(),
        'ArrowUp': () => vobj.volume = Math.min(vobj.volume + volume_step, 1),
        'ArrowDown': () => vobj.volume = Math.max(vobj.volume - volume_step, 0),
        'ArrowRight': () => vobj.currentTime += forward_step,
        'ArrowLeft': () => vobj.currentTime = Math.max(0, vobj.currentTime - forward_step),
    };

    // *********************************************************************************
    // Website-Wise Additional Func
    // bilibili funcs
    if (host.includes('bilibili')) {
        poll_for_element('.bpx-player-ctrl-web', function (fpBtn) {
            controls['Shift+Enter'] = () => { fpBtn.click.call(fpBtn) };
        });
        poll_for_element('.bpx-player-ctrl-wide-enter', function (btn) {
            controls['Shift+T'] = () => { btn.click.call(btn); };
        });
    }

    // *********************************************************************************
    // Event listener for keyup events
    document.addEventListener('keydown', function (event) {
        const key = (event.shiftKey ? 'Shift+' : '') + event.key;
        const action = controls[key];
        if (action && typeof action === 'function') {
            dlog(key, ' pressed.');
            action();
        }
    });
})();