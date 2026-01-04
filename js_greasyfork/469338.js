// ==UserScript==
// @name         Miigon's Youtube script
// @namespace    https://blog.miigon.net/
// @version      0.6
// @description  useful enhancements for my own youtube enjoyments
// @author       Miigon
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469338/Miigon%27s%20Youtube%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/469338/Miigon%27s%20Youtube%20script.meta.js
// ==/UserScript==

/* Long press right arrow key to speed up video playback */
const RIGHT_ARROW_SPEEDUP_PRESS_TIME_MS = 500; // key hold time before speeding up
const SPEED_UP_PLAYBACK_RATE = 3;
/* Seeking in youtube shorts */
const SHORTS_SEEK_SECS = 5;

(function() {
    'use strict';

    let mlog = (...args)=>{console.log("miigon's ytb script:", ...args)}

    let right_pressed = false;
    let is_speeding_up = false;
    let speeding_timeout = -1; // timeout waiting before starting speeding up
    let last_playback_rate = 1;

    let is_shorts = () => window.location.href.includes("/shorts/");
    let is_editing = () => document.activeElement.contentEditable == "true";

    // youtube uses javascript to navigate around.
    // so cached_player is only valid if the page is still the same.
    let cached_player_href = null;
    let cached_player = null;
    let getPlayerElement = () => {
        if(window.location.href == cached_player_href && cached_player) {
            return cached_player;
        }

        mlog("invalidate player element cache")
        cached_player = null;
        let ytd_player = [...document.getElementsByTagName("ytd-player")];
        if(is_shorts()) {
            cached_player = ytd_player.find(v=>v.className.indexOf("ytd-shorts")!=-1);
        } else { // normal full-length video
            cached_player = ytd_player.find(v=>
                v.className.indexOf("preview") == -1
                && v.className.indexOf("ytd-shorts") == -1
            );
        }
        if(cached_player != null) {
            cached_player_href = window.location.href;
        }
        return cached_player;
    }
    let getPlayer = () => getPlayerElement().getPlayer();
    let getPlayerVideoTag = () => getPlayerElement().getElementsByTagName("video")[0];



    document.addEventListener("keydown", (e)=>{
        let used = false;

        // skip hotkeys when editing comment etc.
        if(is_editing()) return;

        if(e.key === "ArrowLeft") {
            // enables left seeking in shorts
            // ArrowRight is handled in keyup instead of keydown.
            if(is_shorts()){
                getPlayer().seekBy(-SHORTS_SEEK_SECS);
            }
        }

        if(e.miigon_ignore) {
            return;
        }

        if(e.key === "ArrowRight") {
            if(right_pressed == false){
                right_pressed = true;
                mlog("right pressed");
                speeding_timeout = setTimeout(()=>{
                    speeding_timeout = -1;
                    is_speeding_up = true;
                    let v = getPlayerVideoTag();
                    last_playback_rate = v.playbackRate;
                    v.playbackRate = SPEED_UP_PLAYBACK_RATE;
                    mlog("speeding up");

                    used = true;
                }, RIGHT_ARROW_SPEEDUP_PRESS_TIME_MS);
            }
            used = true;
        }

        if(used){
            e.stopPropagation();
            e.preventDefault();
        }
    }, /*useCapture*/true);

    document.addEventListener("keyup", (e)=>{
        let used = false;

        // skip hotkeys when editing comment etc.
        if(is_editing()) return;

        if(e.key === "ArrowRight") {
            right_pressed = false;
            if(speeding_timeout != -1) { // keyup before speeding up begins
                clearTimeout(speeding_timeout);
                speeding_timeout = -1;

                if(is_shorts()){
                    // shorts, so simulating a right arrow keypress wont work
                    // tell the player to seek directly.
                    // this enables right seeking in shorts
                    getPlayer().seekBy(SHORTS_SEEK_SECS);
                } else { // normal video
                    // dispatch a normal right arrow keypress event.
                    let event = new KeyboardEvent("keydown", {keyCode: 39})
                    event.miigon_ignore = true; // the script should not process this event
                    document.dispatchEvent(event);
                }
            }
            if(is_speeding_up) { // keyup after speeding up begins
                is_speeding_up = false;
                mlog("stop speeding up");
                getPlayerVideoTag().playbackRate = last_playback_rate;
                used = true;
            }
        }

        if(used){
            e.stopPropagation();
            e.preventDefault();
        }
    }, /*useCapture*/true);
})();