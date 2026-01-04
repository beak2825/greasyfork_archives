// ==UserScript==
// @name        more fps
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      moongazer07
// @license IPFMO/∞-1
// @description 29/05/2024, 11:11:36
// @downloadURL https://update.greasyfork.org/scripts/496573/more%20fps.user.js
// @updateURL https://update.greasyfork.org/scripts/496573/more%20fps.meta.js
// ==/UserScript==

const FPS = 313337;

const cb = [];
setInterval((a=cb.slice(),b=cb.length=0) => a.forEach(f=>f(document.timeline.currentTime)), 100001-FPS);
window.requestAnimationFrame = f=>cb.push(f);