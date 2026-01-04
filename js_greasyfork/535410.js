// ==UserScript==
// @name         Reddit Alwayshello Random
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Leverages the alwayshello API used by redditrand.com to redirect to a random subreddit.
// @author       PXA
// @match        *://*.reddit.com/*
// @grant        GM.xmlHttpRequest
// @run-at       document-idle
// @connect      api.alwayshello.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535410/Reddit%20Alwayshello%20Random.user.js
// @updateURL https://update.greasyfork.org/scripts/535410/Reddit%20Alwayshello%20Random.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function goRandom(link) {
        const nsfw = link.target.text.toLowerCase().includes("nsfw") ? 1 : 0;
        const r = await GM.xmlHttpRequest({ url: `https://api.alwayshello.com/reddit-runner/rand?nsfw=${nsfw}` }).catch(e => console.error(e));
        window.location.href = `${window.location.origin}${JSON.parse(r.responseText).url}`;
    }

    const anchors = document.querySelectorAll('a.subbarlink');
    for (let i = 0; i < anchors.length; i++) {
        if (['/r/random/', '/r/randnsfw/'].includes(anchors[i].attributes.href.value)) {
            anchors[i].onclick = goRandom;
            anchors[i].href = "#";
        }
    }

})();
