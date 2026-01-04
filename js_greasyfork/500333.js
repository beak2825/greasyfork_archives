// ==UserScript==
// @name        Help support Bit-Gamey in the Unity Asset store
// @namespace   Violentmonkey Scripts
// @match       https://assetstore.unity.com/packages/*
// @grant       none
// @version     1.0
// @author      Schaken
// @icon        https://render-state.to/wp-content/uploads/2020/09/cropped-favicon-290x290.png
// @license     MIT
// @description This just checks to see if you have Bit-Gamey code in the url, if you do not, it adds it. this will support our good friend!
// @downloadURL https://update.greasyfork.org/scripts/500333/Help%20support%20Bit-Gamey%20in%20the%20Unity%20Asset%20store.user.js
// @updateURL https://update.greasyfork.org/scripts/500333/Help%20support%20Bit-Gamey%20in%20the%20Unity%20Asset%20store.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const aidParam = '?aid=1100le847';
    const currentURL = new URL(window.location.href);
    let urlSearchParams = new URLSearchParams(currentURL.search);

    if (!urlSearchParams.has('aid')) {
        urlSearchParams.set('aid', '1100le847');
        currentURL.search = urlSearchParams.toString();
        window.history.replaceState(null, '', currentURL.toString());
    }
})();
