// ==UserScript==
// @name        Peaceful Twitch (without numbers / gamification)
// @namespace   Violentmonkey Scripts
// @match       https://*.twitch.tv/*
// @grant       none
// @version     1.1
// @author      Code With Sarah
// @description 14/09/2022, 00:07:48
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/451451/Peaceful%20Twitch%20%28without%20numbers%20%20gamification%29.user.js
// @updateURL https://update.greasyfork.org/scripts/451451/Peaceful%20Twitch%20%28without%20numbers%20%20gamification%29.meta.js
// ==/UserScript==

  // hide viewer count for list view (and front page)
  // hide viewer count while watching a stream:
let styles = `
.iiA-dIp.side-nav-card__live-status span.CoreText-sc-cpl358-0.iUznyJ,
.front-page-carousel div.Layout-sc-nxg1ff-0.bAGmmD > p.CoreText-sc-cpl358-0:last-child {
    display: none;
}

.home-header-sticky p.CoreText-sc-cpl358-0.gVjya,
.about-section__panel--content div.Layout-sc-nxg1ff-0.imwaRG:first-child,
.ScPositionCorner-sc-1iiybo2-1:nth-child(3) .tw-media-card-stat,
[data-a-target='animated-channel-viewers-count'] {
  visibility: hidden;
}

.home-header-sticky p.CoreText-sc-cpl358-0.gVjya::before,
.about-section__panel--content div.Layout-sc-nxg1ff-0.imwaRG:first-child::before,
.ScPositionCorner-sc-1iiybo2-1:nth-child(3) .tw-media-card-stat::before,
[data-a-target='animated-channel-viewers-count']::before {
  content: '🌷🌸🌻';
  visibility: visible;
  /*
  display: block;
  position: absolute;
  left: 0;*/
  background: rgba(0,0,0,0.2);
}

.ach-card,
.quest-header,
[data-test-selector='not-completed-achievements-list'],
[data-test-selector='recently-completed-achievements-list'] {
  visibility: hidden;
}

.ach-card,
.quest-header,
[data-test-selector='not-completed-achievements-list'],
[data-test-selector='recently-completed-achievements-list'] {
  position: relative;
}

.ach-card::after,
.quest-header::after,
[data-test-selector='not-completed-achievements-list']::before,
[data-test-selector='recently-completed-achievements-list']::before {
  content: '🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸🌻🌷🌸';
  visibility: visible;
`;

let styleSheet = document.createElement("style");
styleSheet.innerText = styles;

document.head.appendChild(styleSheet);
