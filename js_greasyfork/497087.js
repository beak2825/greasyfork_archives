// ==UserScript==
// @name         Switch to 4chan Archive
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically switch to a 4chan archive site when browsing 4chan archives and threads.
// @match        https://boards.4chan.org/*/thread/*
// @match        https://boards.4channel.org/*/thread/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497087/Switch%20to%204chan%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/497087/Switch%20to%204chan%20Archive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the thread number from the URL
    const board = window.location.href.match(/boards\.4chan\.org\/(\w+)\//)[1];
    const threadNumber = parseInt(window.location.href.match(/\/thread\/(\d+)/)[1]);
    // Redirect to Warosu
    window.location.href = `https://warosu.org/${board}/thread/${threadNumber}`;
}
)();