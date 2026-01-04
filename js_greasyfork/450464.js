// ==UserScript==
// @name         WME Zoom Limit
// @namespace    https://fxzfun.com/
// @version      0.1
// @description  limits how far out you can zoom
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/450464/WME%20Zoom%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/450464/WME%20Zoom%20Limit.meta.js
// ==/UserScript==

/* global W */

(function() {
    'use strict';

    if (location.href.match(/^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/) != null) {
        var i = setInterval(() => {
            if (W.map.wazeMap) {
                clearInterval(i);
                W.map.wazeMap.setMinZoomLevel(12);
            }
        }, 1000);
    }
})();