// ==UserScript==
// @name         Bunpro - Slower Audio During Reviews
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  This will slow down the audio during Bunpro reviews to 75% of the normal speed
// @author       blacktide
// @include      /^https://bunpro.jp/(study|cram).*$/
// @require      https://greasyfork.org/scripts/432418-wait-for-selector/code/Wait%20For%20Selector.js?version=974366
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bunpro.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447930/Bunpro%20-%20Slower%20Audio%20During%20Reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/447930/Bunpro%20-%20Slower%20Audio%20During%20Reviews.meta.js
// ==/UserScript==

(function(wfs) {
    'use strict';
    const playbackRate = 0.75;
    wfs.wait('audio', function(e) {
        console.log("New audio detected, slowing playback to " + playbackRate);
        document.querySelectorAll('audio').forEach(audio => audio.playbackRate = playbackRate);
    });
})(window.wfs);