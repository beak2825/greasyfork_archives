// ==UserScript==
// @name         Netflix: Stealth mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide title, descriptions, and video preview of the current show
// @author       Ping
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394754/Netflix%3A%20Stealth%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/394754/Netflix%3A%20Stealth%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
/* Main show description on the show's title page. */
.jawBone h1, .overview .synopsis, .overview .evidence, .overview .meta-lists {
  visibility: hidden;
}
/* Large background image and auto-playing video on the show's title page */
.jawBoneBackground, .background .VideoContainer {
  visibility: hidden;
}
/* Episode descriptions in the episode carousel on the show's title page */
.episodeTitle, .episodeSynopsis {
  visibility: hidden;
}
/* Show title and show information overlays on the main watch page */
.video-title, .player-title-evidence, .evidence-overlay {
  visibility: hidden;
}
`;
    head.appendChild(style);
})();
