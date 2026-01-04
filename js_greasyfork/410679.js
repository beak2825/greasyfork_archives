// ==UserScript==
// @name         fix tumblr videos
// @namespace    https://pj.codes/
// @version      0.15
// @description  i hate tumblr video controls
// @author       pj
// @match        *://*.tumblr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410679/fix%20tumblr%20videos.user.js
// @updateURL https://update.greasyfork.org/scripts/410679/fix%20tumblr%20videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //controls are a stateful component on hover so I have to add css instead of targeting elements with the class
    var style = document.createElement('style');
    style.innerHTML = `
._37q04 { pointer-events: none !important; opacity: 0; }
.vjs-control-bar, .vjs-big-play-button { pointer-events: none !important; opacity: 0; }
`;
    document.head.appendChild(style);

    const body = document.querySelector('body');
    const options = { attributes: true, childList: true, subtree: true };

    //observes for new nodes and turns on the native media controls for the last child added to the list
    const cb = function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                body.querySelectorAll('video').forEach(function(video) {
                    video.setAttribute('controls','controls');
                    console.log('Video Found.');
                });
            }
        }
    }
    const observer = new MutationObserver(cb);
    observer.observe(body, options);
})();