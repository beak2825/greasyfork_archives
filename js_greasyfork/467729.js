// ==UserScript==
// @name         YouTube Music Auto-Like
// @version      1.0
// @description  The YouTube Music Auto-Like is a Tampermonkey script that enhances your YouTube Music experience by enabling automatic liking of the currently playing song through a specific key press, even when the YouTube Music page is running in the background. The script works in tandem with a concurrently running Python script for seamless operation. Ensure both scripts are active for the best experience.
// @author       kb5000
// @license      MIT
// @match        https://music.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/467729/YouTube%20Music%20Auto-Like.user.js
// @updateURL https://update.greasyfork.org/scripts/467729/YouTube%20Music%20Auto-Like.meta.js
// ==/UserScript==
let first_start = true;

function click_like_button() {
    document.querySelectorAll(".like")[0].click()
}

function check_button_state() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://127.0.0.1:15065/",
        headers: {},
        onload: function(response) {
            if (response.responseText === 'true' && !first_start) {
                // console.log("like!!!")
                click_like_button()
            }
            first_start = false
        }
    });
}

(function() {
    'use strict';
    check_button_state()
    setInterval(check_button_state, 3000)
})();
