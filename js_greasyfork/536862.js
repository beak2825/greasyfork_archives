// ==UserScript==
// @name         MusicBrainz: Automatically show AcoustIDs
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.3.2
// @description  Automatically triggers the "Show acoustIDs" function of loujine's script
// @tag          ai-created
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/artist/*/recordings*
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536862/MusicBrainz%3A%20Automatically%20show%20AcoustIDs.user.js
// @updateURL https://update.greasyfork.org/scripts/536862/MusicBrainz%3A%20Automatically%20show%20AcoustIDs.meta.js
// ==/UserScript==

if (document.querySelector('.tbl th:last-of-type')?.textContent.trim() !== 'AcoustID') {
        document.querySelector('#showAcoustids')?.click();
}