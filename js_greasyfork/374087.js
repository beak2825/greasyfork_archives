// ==UserScript==
// @name         OPS Required Fields
// @namespace    orpheus.network
// @version      4
// @description  Make fields on upload page required so that the submit button does not work until filled in
// @author       SIGTERM86 | ported to OPS by KAPPLEJACLS
// @include      https://orpheus.network/upload.php*
// @downloadURL https://update.greasyfork.org/scripts/374087/OPS%20Required%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/374087/OPS%20Required%20Fields.meta.js
// ==/UserScript==

var requiredIds = ["file", "artist", "title", "year", "releasetype", "format", "bitrate", "media", "tags"];

(function() {
    'use strict';
    for (var i=0; i<requiredIds.length; i++) {
        document.getElementById(requiredIds[i]).required = true;
    }
})();