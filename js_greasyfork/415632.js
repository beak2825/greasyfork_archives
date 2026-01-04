// ==UserScript==
// @name         Undelete Clips
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download deleted twitch clips
// @author       You
// @match        https://www.reddit.com/r/LivestreamFail/comments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415632/Undelete%20Clips.user.js
// @updateURL https://update.greasyfork.org/scripts/415632/Undelete%20Clips.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fetch(document.URL.slice(0, -1) + '.json').then(response => response.json()).then(data => {
        let url = data[0].data.children[0].data.secure_media.oembed.thumbnail_url.slice(0, -19) + '.mp4';

        let a = document.createElement('a');
        a.appendChild(document.createTextNode(" (Get Deleted Clip)"));
        a.href = url;
        document.getElementsByClassName('domain')[0].appendChild(a);
     });

})();