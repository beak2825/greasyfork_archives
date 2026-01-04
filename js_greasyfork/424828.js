// ==UserScript==
// @name         Comically Fast Replays
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Speeds menu replays to x5 speed!
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424828/Comically%20Fast%20Replays.user.js
// @updateURL https://update.greasyfork.org/scripts/424828/Comically%20Fast%20Replays.meta.js
// ==/UserScript==

let replayspeed = document.getElementById('bgreplay_timescrub');
replayspeed.max = 100;
replayspeed.value = 5;
