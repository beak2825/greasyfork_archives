// ==UserScript==
// @name         Comically Slow Replays
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Slows menu replays to x0.5 speed!
// @author       Evil ban (special thanks to MYTH_doglover)
// @match        https://bonk.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429915/Comically%20Slow%20Replays.user.js
// @updateURL https://update.greasyfork.org/scripts/429915/Comically%20Slow%20Replays.meta.js
// ==/UserScript==

let replayspeed = document.getElementById('bgreplay_timescrub');
replayspeed.max = 100;
replayspeed.value = 0.5;
