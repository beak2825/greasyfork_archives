// ==UserScript==
// @name         preservetube
// @namespace    preservetube
// @version      2.1
// @description  Pressing "CTRL+SHIFT+D" opens the current YouTube video URL in PreserveTube for saving. Pressing "CTRL+SHIFT+V" opens the channel URL for saving.
// @author
// @match        https://www.youtube.com/*
// @grant        none
// @icon         https://i.imgur.com/z8zguyi.png
// @downloadURL https://update.greasyfork.org/scripts/524463/preservetube.user.js
// @updateURL https://update.greasyfork.org/scripts/524463/preservetube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey) {
            event.preventDefault();
            if (event.key === 'D') {
                // For saving the current video
                let currentUrl = window.location.href;
                let modifiedUrl = 'https://preservetube.com/save?url=' + encodeURIComponent(currentUrl);
                window.open(modifiedUrl, '_blank');
            } else if (event.key === 'V') {
                // For saving the channel
                let channelUrl = window.location.href;
                let saveChannelUrl = 'https://preservetube.com/savechannel?url=' + encodeURIComponent(channelUrl);
                window.open(saveChannelUrl, '_blank');
            }
        }
    });
})();