// ==UserScript==
// @license      GPL3
// @name         Force DGG Kick Embed
// @version      1.0.0
// @description  Forces the destiny.gg bigscreen to embed his Kick.com stream.
// @author       mynameisben (original code by Seb3thehacker)
// @match        https://www.destiny.gg/bigscreen
// @grant        none
// @namespace https://greasyfork.org/en/users/1127844-mynameisben
// @downloadURL https://update.greasyfork.org/scripts/470926/Force%20DGG%20Kick%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/470926/Force%20DGG%20Kick%20Embed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL to whatever embed you want to force.
    var embedUrl = 'https://player.kick.com/destiny'; // Replace "channelname" with the desired Twitch channel or video

    // Create an <iframe> element
    var iframeElement = document.createElement('iframe');
    iframeElement.src = embedUrl;
    iframeElement.width = '100%';
    iframeElement.height = '100%';
    iframeElement.frameBorder = '0';
    iframeElement.allowFullscreen = true;

    // Find the <div> element with the id "embed"
    var embedDiv = document.getElementById('embed');

    // Append the <iframe> element to the <div> element
    if (embedDiv) {
        embedDiv.appendChild(iframeElement);
    }

    var offlineTextElement = document.getElementById('offline-text');

    // Remove the offline text element, allows you to click play.
    if (offlineTextElement) {
        offlineTextElement.remove();
    }

    // Remove the stream-block div
    var streamBlockElement = document.getElementById('stream-block');
    if (streamBlockElement) {
        streamBlockElement.remove();
    }
})();