// ==UserScript==
// @name        Copyright Notice Delyeeter
// @namespace   Violentmonkey Scripts
// @match       https://vstream.*.panopto.com/Panopto/Pages/Viewer.aspx
// @include     /^https?://vstream\..+\.panopto\.com\/Panopto\/Pages\/Viewer\.aspx.*/
// @grant       none
// @version     1.0
// @author      BIOS9
// @description Removes copyright notice from Panopto player.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441109/Copyright%20Notice%20Delyeeter.user.js
// @updateURL https://update.greasyfork.org/scripts/441109/Copyright%20Notice%20Delyeeter.meta.js
// ==/UserScript==


(function() {
    'use strict';
    Panopto.viewer.showCopyrightNotice = false;
})();