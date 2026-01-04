// ==UserScript==
// @name         [DEPRECATED] MusicBrainz: Artwork Uploader Thumbnails Accelerator
// @namespace    https://musicbrainz.org/user/chaban
// @version      1.0.6
// @tag          ai-created
// @description  Replaces data URI thumbnails on the artwork uploader with object URLs for better performance.
// @author       chaban
// @license      MIT
// @match        *://*.musicbrainz.org/release/*/add-cover-art*
// @match        *://*.musicbrainz.org/event/*/add-event-art*
// @grant        none
// @icon         https://musicbrainz.org/static/images/favicons/android-chrome-512x512.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544139/%5BDEPRECATED%5D%20MusicBrainz%3A%20Artwork%20Uploader%20Thumbnails%20Accelerator.user.js
// @updateURL https://update.greasyfork.org/scripts/544139/%5BDEPRECATED%5D%20MusicBrainz%3A%20Artwork%20Uploader%20Thumbnails%20Accelerator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = GM.info.script.name;
    const MESSAGE =
        `MusicBrainz: Artwork Uploader Thumbnails Accelerator is now DEPRECATED.\n\n` +
        `This script is no longer needed as the optimization is now built into MusicBrainz.\n\n` +
        `Please uninstall the script from your userscript manager.`;

    console.info(`[${SCRIPT_NAME}]: Script is deprecated and no longer required. Please uninstall.`);
    window.alert(MESSAGE);
})();