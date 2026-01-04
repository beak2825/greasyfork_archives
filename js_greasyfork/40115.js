// ==UserScript==
// @name         Khan Academy YouTube Playback Rate Enforcer
// @namespace    https://jeffschofield.com/
// @version      0.4
// @description  Remembers the playback rate you set on Khan Academy's YouTube player and enforces it across lessons
// @author       Jeff Schofield
// @match        https://www.khanacademy.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/40115/Khan%20Academy%20YouTube%20Playback%20Rate%20Enforcer.user.js
// @updateURL https://update.greasyfork.org/scripts/40115/Khan%20Academy%20YouTube%20Playback%20Rate%20Enforcer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ENFORCED = Symbol('enforced');
    const GM_KEY = 'jeffschofield.com-playback_rate';
    const YOUTUBE_ORIGIN = /^https?:\/\/[-\.\w]*\.youtube(-nocookie)?\.com.*$/;

    var PLAYBACK_RATE = GM_getValue(GM_KEY, 1);
    function updatePlaybackRate({ data }) {
        if (data === PLAYBACK_RATE) return; // No change
        GM_setValue(GM_KEY, PLAYBACK_RATE = data);

        // console.log(`Debug: Updated playback rate to '${ PLAYBACK_RATE }'`);
    }

    window.addEventListener('message', ({ data, origin }) => { // The YouTube iFrame API uses the `message` event to communicate, so we watch here for any activity in the page
        if (!origin.match(YOUTUBE_ORIGIN)) return; // Ensure this message is from YouTube

        data = JSON.parse(data); // Message data is passed as JSON. Parse it
        let { event, info, id, channel } = data; // Destructure the parsed message data

        if (event === 'onReady') { // Watch for the onReady event coming from any iframe player

            // Note: I briefly explored using the ID and Channel to communicate directly with the player instead of re-scanning every `onReady` event,
            // ultimately the scanning method was faster to implement for the time I have. Revisions are welcome!

            document.querySelectorAll('iframe[id]').forEach($iframe => { // Scan through all iframes with an ID attribute defined on the page
                let player = YT.get($iframe.id); // Try to get a reference to the YT.Player instance attached to this iframe, if any

                if (!player) return; // No player instance on this iframe
                if (player[ENFORCED]) return; // Already enforced playback on this player

                player.setPlaybackRate(PLAYBACK_RATE); // Enforce playback rate!
                player.addEventListener('onPlaybackRateChange', updatePlaybackRate); // Listen for playback rate changes on this player to update the remembered value
                player[ENFORCED] = true; // Brand this player instance with our symbol to indicate it has been enforced

                // console.log(`Debug: Enforcing playback rate on '${ $iframe.id }'`);
            });
        }
    });
})();