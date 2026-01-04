// ==UserScript==
// @name         Jellyfin 倍速播放
// @namespace    http://tampermonkey.net/
// @version      2024-01-08
// @description  Jellyfin 倍速播放!
// @author       You
// @match        *://*/*/web/index.html
// @match        *://*/web/index.html
// @match        *://*.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nieb.top
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486898/Jellyfin%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/486898/Jellyfin%20%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let vEle = document.querySelector("video");
    function getPlaybackRate(){
        if(vEle !== null){
            return document.querySelector("video").playbackRate;
        }}
    let isKeyDown = false;
    let originalSpeed = "1";
    //originalSpeed = getPlaybackRate();
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Control') { // q key
            isKeyDown = true;
            const setPlaybackSpeed = () => {
                if (isKeyDown) {
                    document.querySelector("video").playbackRate="3"
                }
                setTimeout(setPlaybackSpeed, 200);
            };
            setPlaybackSpeed();
        }

        document.addEventListener('keyup', function(event) {
            if (event.key === 'Control') { // q key
                isKeyDown = false;
                document.querySelector("video").playbackRate=originalSpeed;

            }
        });
    });
})();
