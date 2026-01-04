// ==UserScript==
// @name         komi-san >W<
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables komi san websites inappropriate ads
// @author       You
// @match        *://w1.komisanwamanga.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431445/komi-san%20%3EW%3C.user.js
// @updateURL https://update.greasyfork.org/scripts/431445/komi-san%20%3EW%3C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const next = document.getElementsByClassName('next-post')[0];
    const prev = document.getElementsByClassName('prev-post')[0];
    next.classList.splice(next.classList.indexOf('next-post'),1);
    prev.classList.splice(prev.classList.indexOf('prev-post'),1);
})();