// ==UserScript==
// @name         Gazelle Required Fields
// @namespace    https://greasyfork.org/en/users/90188
// @version      2
// @description  Make fields on upload page required so that the submit button does not work until filled in
// @author       thegeek (but really SIGTERM86 on PTH)
// @match        https://*apollo.rip/upload.php
// @match        https://*passtheheadphones.me/upload.php
// @downloadURL https://update.greasyfork.org/scripts/26158/Gazelle%20Required%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/26158/Gazelle%20Required%20Fields.meta.js
// ==/UserScript==

var requiredIds = ["file", "artist", "title", "year", "releasetype", "format", "bitrate", "media", "tags"];

(function() {
    'use strict';
    for (var i=0; i<requiredIds.length; i++) {
        document.getElementById(requiredIds[i]).required = true;
    }
})();