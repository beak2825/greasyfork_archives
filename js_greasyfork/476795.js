// ==UserScript==
// @name    Auto Embed Youtube / Kick - destiny.gg
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @grant       none
// @version     1.0
// @author      Awesumness
// @description Defaults to Youtube with a Kick fallback
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/476795/Auto%20Embed%20Youtube%20%20Kick%20-%20destinygg.user.js
// @updateURL https://update.greasyfork.org/scripts/476795/Auto%20Embed%20Youtube%20%20Kick%20-%20destinygg.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var embedBlock = document.getElementById('stream-block');
    if(embedBlock){
        embedBlock.remove();
    }

    var offlineText = document.getElementById('offline-text');
    if(offlineText){
        offlineText.remove();
    }

    const getJSON = async url => {
        const response = await fetch(url);
        return response.json(); // get JSON from the response
    }

    getJSON('https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=UC554eY5jNUfDq3yDOJYirOQ&maxResults=20&order=date&key=AIzaSyDx0h5q8k9hlfgxmgulj-Gy7lRfM8G8lhM')
        .then(data => {
            var ytId;
            for (const item of data.items) {
                if (item.snippet.liveBroadcastContent == "live") {
                    ytId = item.id.videoId;
                }
            }

            var videoLink;
            if (ytId) {
                videoLink = 'https://www.youtube.com/embed/' + ytId + "?autoplay=1&mute=1";
            } else {
                videoLink = 'https://player.kick.com/destiny';
            }

            var iframeElement = document.createElement('iframe');
            iframeElement.src = videoLink;
            iframeElement.width = '100%';
            iframeElement.height = '100%';
            iframeElement.frameBorder = '0';
            iframeElement.allow = "fullscreen; autoplay; encrypted-media; picture-in-picture; web-share"

            var embedDiv = document.getElementById('embed');
            if (embedDiv) {
                embedDiv.innerHTML = '';
                embedDiv.appendChild(iframeElement);
            }
        });
})();