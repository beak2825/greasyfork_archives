// ==UserScript==
// @name                Boxy-SVG.com Bypass
// @description         Bypass subscription block and enable file exporting
// @author              ScamCast
// @version             1.0
// @grant               none
// @match               https://boxy-svg.com/app*
// @namespace https://greasyfork.org/users/718362
// @downloadURL https://update.greasyfork.org/scripts/418981/Boxy-SVGcom%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/418981/Boxy-SVGcom%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('app').checkDiskWriteAccess = function() {return ["granted", null]};
})();