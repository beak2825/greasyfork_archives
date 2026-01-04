// ==UserScript==
// @name         Twitch - Auto Best Video Quality
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Twitch - Auto Best Video Quality (1440p, 1080p, 720p etc)
// @author       Martin______X
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543926/Twitch%20-%20Auto%20Best%20Video%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/543926/Twitch%20-%20Auto%20Best%20Video%20Quality.meta.js
// ==/UserScript==

let $url = "";
let $working = false;
let $step = 1;
let $delay = 0;
let $video_height = 0;
let $cd = 0;

const simpleClick = (async (target, step) => {
    if (target) {
        target.click();
    }
    if (step == 5) {
        $working = false;
        $step = 1;
        $delay = 0;
    } else {
        $step++;
    }
});

const twitchVideoQualityInterval = setInterval(() => {
    try {
        let url = document.URL;
        let video = document.querySelector("video");

        if (url != $url) {
            $url = url;
            $working = true;
            $step = 1;
            $delay = 0;
            $video_height = 0;
        }
        if (is_resolution_changed(video)) {
            $working = true;
        }
        if ($working && is_video_playing(video)) {
            if ($delay < 100) {
                $delay++;
            } else {
                if ($step == 1) {
                    let settings_button = document.querySelector('button[data-a-target="player-settings-button"]');
                    if (settings_button) {
                        simpleClick(settings_button, 1);
                    }
                }
                if ($step == 2) {
                    let quality_button = document.querySelector('button[data-a-target="player-settings-menu-item-quality"]');
                    if (quality_button) {
                        simpleClick(quality_button, 2);
                    }
                }
                if ($step == 3) {
                    let inputs = document.querySelectorAll('input[name="player-settings-submenu-quality-option"]');
                    let input = get_best_quality_input(inputs);
                    if (input) {
                        simpleClick(input, 3);
                    }
                }
                if ($step == 4) {
                    let main_menu = document.querySelector('button[data-test-selector="main-menu"]');
                    if (main_menu) {
                        simpleClick(main_menu, 4);
                    }
                }
                if ($step == 5) {
                    let menuitem = document.querySelector('button[role="menuitem"]');
                    if (menuitem) {
                        simpleClick(menuitem, 5);
                    }
                }
            }
        }
    } catch (error) {
        //console.warn(error);
    }
}, 1);

const hide_panel_interval = setInterval(() => {
    try {
        let video = document.querySelector("video");
        if($working && is_video_playing(video)){
            $cd = 100;
        }else{
            $cd = 0;
        }
        if($cd>0){
            let reactModal = document.querySelector('.ReactModal__Content[role="menu"]');
            let div = reactModal.querySelector('div[data-popper-reference-hidden][data-popper-escaped][data-popper-placement]');
            div.style.opacity = '0';
            $cd--;
        }
    } catch (error) {
        //console.warn(error);
    }
}, 1);

const is_video_playing = (video) => {
    if(video && video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2){
        return true;
    }
}

const is_resolution_changed = (video) => {
    if (video) {
        let h = video.videoHeight;
        return h != $video_height;
    }
}

const get_best_quality_input = (inputs) => {
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        let span = input.nextSibling.querySelector('span');
        if (span) {
            if (input.hasAttribute("DISABLED")) {
                i++;
                input = inputs[i];
            }
            let height = input.nextSibling.children[0].children[0].innerText;
            height = height.split("p")[0];
            $video_height = height;
            return input;
        }
    }
}