// ==UserScript==
// @name        buruburu slack
// @description   make slack avatar vibration
// @namespace   Violentmonkey Scripts
// @match       https://app.slack.com/*
// @grant    GM_addStyle
// @inject-into content
// @version 0.0.1.20210322094722
// @downloadURL https://update.greasyfork.org/scripts/423753/buruburu%20slack.user.js
// @updateURL https://update.greasyfork.org/scripts/423753/buruburu%20slack.meta.js
// ==/UserScript==

GM_addStyle(`
  @keyframes vibration {
    0% {transform: translate(0px, 0px) rotateZ(0deg)}
    25% {transform: translate(4px, 4px) rotateZ(1deg)}
    50% {transform: translate(0px, 4px) rotateZ(0deg)}
    75% {transform: translate(4px, 0px) rotateZ(-1deg)}
    100% {transform: translate(0px, 0px) rotateZ(0deg)}
  }
  .c-avatar {
    animation: 0.1s linear infinite vibration;
  }
`);
