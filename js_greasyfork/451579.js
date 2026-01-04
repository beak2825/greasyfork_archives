// ==UserScript==
// @name           Youtube scroll lock timestamp in picture-in-picture
// @name:ja        YouTubeでピクチャーインピクチャー使用時、タイムスタンプでページトップへの遷移防止
// @namespace      https://github.com/ziopuzzle/
// @version        1.4
// @description    When using Picture-in-Picture (PiP), don't scroll to the top of the page when clicking on a timestamp that displays the time of the video.
// @description:ja 動画をポップアウトしていても、タイムスタンプをクリック時にページトップに強制スクロールする現象を解決します。
// @author         ziopuzzle
// @match          https://www.youtube.com/*
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/451579/Youtube%20scroll%20lock%20timestamp%20in%20picture-in-picture.user.js
// @updateURL https://update.greasyfork.org/scripts/451579/Youtube%20scroll%20lock%20timestamp%20in%20picture-in-picture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SEND_LOG = false;

    function sendLog(s) {
        if (SEND_LOG) {
            console.log('[PIP_SCROLL_LOCK] ' + s);
        }
    }

    function checkPIP() {
        const usingPIP = document.pictureInPictureElement != null;
        // Support for https://greasyfork.org/en/scripts/444382-youtube-mini-player
        const usingFixed = document.querySelector('.ytd-player').style.position == 'fixed';
        // Firefox does not support the Picture-in-Picture API, so we assume that PIP will always be used.
        const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;
        return usingPIP || usingFixed || isFirefox;
    }

    function isThisVideoLink(e) {
        const videoID = new URL(window.location.href).searchParams.get('v');
        const linkVideoID = new URL(e.href).searchParams.get('v');
        return videoID && videoID == linkVideoID;
    }

    function timestampToSeconds(t){
        let parts = t.split(':').reverse();
        if (parts.length < 2) {
            return false;
        }
        let seconds = 0;
        for(let i = 0; i < parts.length; i++){
            switch (i) {
                case 0: seconds += (+parts[i]); break;
                case 1: seconds += (+parts[i])*60; break;
                case 2: seconds += (+parts[i])*60*60; break;
                case 3: seconds += (+parts[i])*60*60*24; break;
            }
        }
        return Number.isInteger(seconds) ? seconds : null;
    }

    document.addEventListener("click", function(e){
        const target =
              e.target.tagName=='A' /* timestamp */
                  ? e.target
                  : e.target.closest("a#endpoint") /* chapter */
                      ? e.target.closest("a#endpoint").querySelector("#details #time")
                      : null;

        if (!isThisVideoLink(target)) {
            sendLog('Link is another video link');
            return;
        }

        const seconds = timestampToSeconds(target.innerText);
        if (seconds !== null) {
            sendLog('Link is valid');
            if (checkPIP()) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                window.movie_player.seekTo(seconds);
                sendLog("seek to " + seconds + "s(" + target.innerText + ")");
            } else {
                sendLog('not PIP mode');
            }
            return;
        } else {
            sendLog('Link is invalid');
        }
    }, {capture: true} );

})();
