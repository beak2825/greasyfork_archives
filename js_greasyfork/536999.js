// ==UserScript==
// @name         MusicBrainz: Auto click confirm form submission
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.3.1
// @description  Automatically clicks the button to confirm submitting (seeding) data from other sites
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/release/add*
// @match        *://*.musicbrainz.org/release/*/edit*
// @match        *://*.musicbrainz.org/recording/create*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/536999/MusicBrainz%3A%20Auto%20click%20confirm%20form%20submission.user.js
// @updateURL https://update.greasyfork.org/scripts/536999/MusicBrainz%3A%20Auto%20click%20confirm%20form%20submission.meta.js
// ==/UserScript==

const urlParams = new URLSearchParams(window.location.search);

if (!urlParams.has('skip_confirmation')) {
    document.querySelector(".confirm-seed button[type='submit']")?.click();
}