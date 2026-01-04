// ==UserScript==
// @name         AutoSpSk: Auto Speed to 112.5% playback on YTM. Auto skip dislikes
// @namespace    http://tampermonkey.net/
// @version      1.5
// @license      mit
// @description  Increases yourtube music playback speed to 112.5%. Skips when a song is disliked
// @author       You
// @match        https://music.youtube.com/*
// @match        https://music.youtube.com/playlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460042/AutoSpSk%3A%20Auto%20Speed%20to%201125%25%20playback%20on%20YTM%20Auto%20skip%20dislikes.user.js
// @updateURL https://update.greasyfork.org/scripts/460042/AutoSpSk%3A%20Auto%20Speed%20to%201125%25%20playback%20on%20YTM%20Auto%20skip%20dislikes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const $$ = (id) => document.getElementById(id)
    const $ = (className) => document.getElementsByClassName(className)

    var considering = false;
    var activelyDisliking = false;
    var oldtitle = "";
    var newtitle = "";

    setInterval(() => {
        if(considering) return;
        considering = true;

        var container = $$('like-button-renderer')
        if (container.getAttribute('like-status') === 'DISLIKE' && !activelyDisliking)
        {
            oldtitle = document.querySelector('yt-formatted-string.title.style-scope.ytmusic-player-bar').innerText;
            console.log("AutoSpSk: Song title = " + oldtitle);

            // Give YTM enough time to skip a disliked song before we check
            delay(500).then(() => {
                newtitle = document.querySelector('yt-formatted-string.title.style-scope.ytmusic-player-bar').innerText;
                if(oldtitle === newtitle && container.getAttribute('like-status') === 'DISLIKE') {
                    // console.log("AutoSpSk: New song title = " + newtitle);
                    console.log("AutoSpSk: Skipping disliked song");
                    var skipBtn = $('next-button')[0]
                    skipBtn.click();
                }
                else {
                    console.log("AutoSpSk: Not skipping");
                }
            } );

        }
        else {
            var video = document.querySelector('video');
            if(video.playbackRate < 1.124) {
                console.log('AutoSpSk: Speed up to 112.5 percent');
                video.playbackRate = 1.125;
            }
        }
        considering = false;
        activelyDisliking = false;
    }, 2500)
})();

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
