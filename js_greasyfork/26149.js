// ==UserScript==
// @name         Apollo & Redacted Required Fields
// @namespace    https://greasyfork.org/en/users/90188
// @version      3
// @description  Make fields on upload page required so that the submit button does not work until filled in
// @author       thegeek (but really SIGTERM86 on PTH)
// @include      https://*apollo.rip/upload.php
// @include      https://*passtheheadphones.me/upload.php
// @include      https://*redacted.ch/upload.php
// @downloadURL https://update.greasyfork.org/scripts/26149/Apollo%20%20Redacted%20Required%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/26149/Apollo%20%20Redacted%20Required%20Fields.meta.js
// ==/UserScript==

var requiredIds = ["file", "artist", "title", "year", "releasetype", "format", "bitrate", "media", "tags"];

(function() {
    'use strict';
    for (var i=0; i<requiredIds.length; i++) {
        document.getElementById(requiredIds[i]).required = true;
    }
})();