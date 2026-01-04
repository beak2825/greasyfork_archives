// ==UserScript==
// @name         9gag auto video control
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically add video controls to videos on 9gag, without using timeout (which use a lot of ressource), but using MutationObserver instead (kind of an event when a video is added). The controls are added when you click on the video, to prevent problems with the function that put sound when you click. For videos without sound ("gif"), controls are shown directly
// @author       momala454
// @match        https://9gag.com/
// @icon         https://www.google.com/s2/favicons?domain=9gag.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429447/9gag%20auto%20video%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/429447/9gag%20auto%20video%20control.meta.js
// ==/UserScript==

(function() {
    'use strict';

	let addVideo = (dom) => dom.querySelectorAll('video').forEach(video => {
        if (video.parentElement.querySelector('.sound-toggle')) {
            // show controls on click for videos with sound to not break sound on when click
            video.addEventListener('click', () => { video.setAttribute('controls', true) })
        }
        else {
            // for gif (videos without sound), no problem to enable it directly
            video.setAttribute('controls', true)
        }
    });

    let onReady = () => {
        addVideo(document.getElementById('list-view-2'));
        (new MutationObserver(function (mutationlist) {
            mutationlist.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(addedNode => {
                        if ((addedNode.classList && addedNode.classList.contains('list-stream')) || !!addedNode.getAttribute?.('id')?.startsWith('jsid-post-')) {
                            addVideo(addedNode);
                        }
                    });
                }

            });
        })).observe(document.getElementById('list-view-2'),{ attributes: false, childList: true, subtree: true});
    };

    if (document.getElementById('list-view-2')) {
        onReady();
    }
    else {
        (new MutationObserver(function (mutationlist) {
            mutationlist.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(item => {
                        if (item.querySelector?.('#list-view-2')) {
                            this.disconnect();
                            onReady();
                        }
                   });
                }
            });
        })).observe(document.getElementById('jsid-app'),{ attributes: false, childList: true, subtree: true});
    }

})();