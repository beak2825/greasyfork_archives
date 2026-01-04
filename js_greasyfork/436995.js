// ==UserScript==
// @name         Twitch fullscreen with comments
// @namespace    @ngokimphu
// @version      1.0.0
// @description  Enter fullscreen mode with comments UI overlayed on the side with opacity
// @author       SirMrDexter, NgoKimPhu
// @match        https://www.twitch.tv/*
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/436995/Twitch%20fullscreen%20with%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/436995/Twitch%20fullscreen%20with%20comments.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function(history) {
    'use strict';
    // override history to fire event
    const pushState = history.pushState;
    history.pushState = function(state) {
        if (typeof history.onpushstate == "function") {
            history.onpushstate({state: state});
        }
        return pushState.apply(history, arguments);
    };

    GM_addStyle(`
        .video-player__container .chat-room {
            position: absolute;
            right: 0;
            top: 15%;
            width: 300px !important;
            height: 50%;
            opacity: .4;
            transition: opacity .25s ease-in-out;
        }
        .video-player__container .chat-room:hover {
            opacity: 1;
        }
    `);

    let maxTries = 16;
    console.log('Twitch fullscreen with comments - enabled');

    let checkInterval = 0;
    let videoContainer, videoRef, chatRoomPanel, chatRoomOrigParent;

    function initialize() {
        if ((videoContainer = document.querySelector('.persistent-player .video-player div.video-player__container')) &&
              videoContainer.querySelector('video')) {
            clearInterval(checkInterval);
        } else {
            console.log('Stream not found!!!');
            if (maxTries-- === 0) {
                console.log('Done with retrying.');
                clearInterval(checkInterval);
            }
            // If elements don't match do nothing and wait.
            return;
        }
        console.log('Found stream applying mods');

        videoRef = videoContainer.querySelector('video').parentElement;
        chatRoomPanel = document.querySelector('.chat-room');
        chatRoomOrigParent = chatRoomPanel.parentElement;
    }

    // swap chat panel on full screen
    document.addEventListener('fullscreenchange', (event) => {
        if (event.target == videoContainer) {
            (document.fullscreenElement ? videoRef : chatRoomOrigParent).appendChild(chatRoomPanel);
        } else {
            console.log('unexpected fullscreen element, event:', event);
        }
    });

    checkInterval = setInterval(initialize, 500);
    history.onpushstate = () => {
        clearInterval(checkInterval);
        maxTries = 10;
        checkInterval = setInterval(initialize, 500);
    };
})(window.history);