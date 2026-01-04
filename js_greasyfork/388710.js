// ==UserScript==
// @name         YouTube Remove Mini-Player
// @namespace    https://greasyfork.org/en/users/162009-delmain
// @author       delmain
// @version      0.1.0
// @description  Never allow the YouTube Mini-Player to open by removing the video element when it is created.
// @match        https://www.youtube.com/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/388710/YouTube%20Remove%20Mini-Player.user.js
// @updateURL https://update.greasyfork.org/scripts/388710/YouTube%20Remove%20Mini-Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var appNode = document.getElementsByTagName('ytd-app');
        var playerNode = document.getElementsByTagName('ytd-miniplayer');

        if(playerNode.length === 1) {
            var config = { childList: true, subtree: true };
            var callback = function(mutationsList) {
                for(let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        for(let node of mutation.addedNodes) {
                            if(node.getElementsByTagName) {
                                let videos = node.getElementsByTagName('video');
                                if(videos.length > 0) {
                                    Array.from(videos).forEach(function(video) {
                                        video.remove();
                                    });
                                    let card = document.getElementById('card');
                                    if(card != null) {
                                        card.hidden = true;
                                    }
                                    console.log('Killed a MiniPlayer for you!');
                                }
                            }
                        }
                    }
                }
            };
            var observer = new MutationObserver(callback);
            observer.observe(playerNode[0], config);
            console.log('Observer deployed to watch and remove MiniPlayer');
        }
    });
})();