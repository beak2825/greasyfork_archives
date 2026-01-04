// ==UserScript==
// @name        ZTX AFK Fix
// @namespace   blueiicey
// @match       https://my.ztx.gd/afk*
// @grant       none
// @version     1.0
// @author      blueiicey
// @icon        https://my.ztx.gd/assets/favicon.png
// @description fixes the websocket disconnecting issue, 3 line fix
// @downloadURL https://update.greasyfork.org/scripts/496062/ZTX%20AFK%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/496062/ZTX%20AFK%20Fix.meta.js
// ==/UserScript==
window.alert = function () {
    window.location.href = window.location.href;
};