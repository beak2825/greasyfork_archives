// ==UserScript==
// @license      GPL3
// @name         Destiny Kick Embed
// @version      1.0.0
// @description  Embeds Kick stream on Destiny.gg and switches between streams automatically.
// @author       Seb3thehacker
// @match        https://www.destiny.gg/bigscreen
// @grant        none
// @namespace https://greasyfork.org/users/1114452
// @downloadURL https://update.greasyfork.org/scripts/469693/Destiny%20Kick%20Embed.user.js
// @updateURL https://update.greasyfork.org/scripts/469693/Destiny%20Kick%20Embed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Twitch channel or video URL
    var twitchUrl = 'https://player.kick.com/destiny'; // Replace "channelname" with the desired Twitch channel or video

    // Create an <iframe> element
    var iframeElement = document.createElement('iframe');
    iframeElement.src = twitchUrl;
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

    // Remove the text from the data-bg-text attribute
    if (offlineTextElement) {
        offlineTextElement.setAttribute('data-bg-text', '');
    }

})();