// ==UserScript==
// @name         Twitch fullscreen with comments
// @version      0.1
// @description  Enter fullscreen mode with comments UI overlayed on the side with opacity
// @author       SirMrDexter
// @match        https://www.twitch.tv/*
// @grant        none
// @namespace    https://greasyfork.org/en/users/445070-sirmrdexter
// @downloadURL https://update.greasyfork.org/scripts/396428/Twitch%20fullscreen%20with%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/396428/Twitch%20fullscreen%20with%20comments.meta.js
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
        // ... whatever else you want to do
        // maybe call onhashchange e.handler
        return pushState.apply(history, arguments);
    };

    const appendCss = () => {
        const css = `.fullscreen-video-wrapper{
position: relative;
width: 100%;
height: 100%;
}
.fullscreen-video-wrapper .chat-room {
position: absolute;
right:0;
top:15%;
width: 300px !important;
opacity: 0.4;
height:50%;
transition: opacity .25s ease-in-out;
}
.fullscreen-video-wrapper .chat-room:hover {
opacity: 1;
}
`,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        head.appendChild(style);

        style.type = 'text/css';
        if (style.styleSheet){
            // This is required for IE8 and below.
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    };
    appendCss();

    let maxTries = 10;
    console.log('Twitch fullscreen with comments - enabled');

    let checkInterval = 0;
    const myWrapperDiv = document.createElement('div');
    myWrapperDiv.id = 'myWrapperDiv';
    myWrapperDiv.className = 'fullscreen-video-wrapper';
    let chatRoomPanel, chatRoomOrigParent;

    function initialize() {
        const videoContainer = document.querySelector('.persistent-player .video-player div.video-player__container');
        if (videoContainer && videoContainer.firstElementChild && (myWrapperDiv === videoContainer.firstElementChild || videoContainer.firstElementChild.tagName == 'VIDEO')) {
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
        const videoEle = videoContainer.querySelector('video');
        const playerControls = document.querySelector('.tw-justify-content-end');
        const originalFullScreenButton = document.querySelector('.player-controls .tw-justify-content-end [data-a-target="player-fullscreen-button"]');
        var clonedFullScreenButton = originalFullScreenButton.cloneNode(true);
        originalFullScreenButton.parentElement.insertBefore(clonedFullScreenButton, originalFullScreenButton);
        clonedFullScreenButton.parentElement.removeChild(originalFullScreenButton);
        if (myWrapperDiv.parentElement !== videoContainer) {
            videoContainer.insertBefore(myWrapperDiv, videoEle);
        }
        myWrapperDiv.appendChild(videoEle);
        // Add fullscreen event
        clonedFullScreenButton.addEventListener('click', (event) => {
            myWrapperDiv.requestFullscreen().then((success)=> {
                console.log('Fullscreen activated');
            });
        });
        // swap chat panel on full screen
        chatRoomPanel = document.querySelector('.chat-room');
        chatRoomOrigParent = chatRoomPanel.parentElement;
    }

    document.addEventListener('fullscreenchange', (event) => {
        if (document.fullscreenElement) {
            myWrapperDiv.appendChild(chatRoomPanel);
            console.log('Moved chat into fullscreen');
        } else {
            chatRoomOrigParent.appendChild(chatRoomPanel);
            console.log('Moved chat out of fullscreen');
        }
    });

    checkInterval = setInterval(initialize, 1000);
    history.onpushstate = () => {
        clearInterval(checkInterval);
        maxTries = 10;
        checkInterval = setInterval(initialize, 1000);
    };
})(window.history);