// ==UserScript==
// @name        Redirect to original maxstream.video
// @namespace   StephenP
// @match       https://fmax13.lol/*
// @match       https://sumax43.autos/*
// @match       https://maxmon23.online/*
// @match       https://samax63.lol/*
// @match       https://maxv.lol/*
// @grant       none
// @version     1.4
// @author      StephenP
// @license     copyleft
// @description Redirect alternative domains to the real maxstream.video website (where uBlock Orign works)
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/525002/Redirect%20to%20original%20maxstreamvideo.user.js
// @updateURL https://update.greasyfork.org/scripts/525002/Redirect%20to%20original%20maxstreamvideo.meta.js
// ==/UserScript==
document.location.host="maxstream.video";
