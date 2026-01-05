// ==UserScript==
// @name         IMSLP Instant Download
// @namespace    http://imslp.org/
// @version      0.1
// @description  Free the Public Domain music library
// @match        http://imslp.org/wiki/*
// @require      http://code.jquery.com/jquery-latest.js
// @copyright    2016, dymaxion
// @downloadURL https://update.greasyfork.org/scripts/16930/IMSLP%20Instant%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/16930/IMSLP%20Instant%20Download.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var dl_link=$("span[id$='sm_dl_wait']").attr("data-id");

if (dl_link) {
    $("span[id$='sm_dl_wait']").replaceWith("<a style='font-weight:bold;font-size: large;line-height: 60px;color: green;' id='free-the-music' href='" + dl_link +"'>Liberate Public Domain music! - Instant Download</a>");
}
