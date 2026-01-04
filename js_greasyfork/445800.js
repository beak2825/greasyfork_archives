// ==UserScript==
// @name         DGT Show all data any zoom level
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script allow to show all data in the DGT map regardless the zoom level
// @author       A citizen
// @match        https://infocar.dgt.es/etraffic/
// @icon         https://img.icons8.com/ios-filled/344/marker-storm.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445800/DGT%20Show%20all%20data%20any%20zoom%20level.user.js
// @updateURL https://update.greasyfork.org/scripts/445800/DGT%20Show%20all%20data%20any%20zoom%20level.meta.js
// ==/UserScript==

(function() {
    'use strict';

    XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;

    const zoomRegex = /zoom=\d+/i;
    const customOpen = function(method, url, async, user, password) {
        const newUrl = url.replace(zoomRegex, 'zoom=14')
        this.realOpen (method, newUrl, async, user, password);
    }

    XMLHttpRequest.prototype.open = customOpen ;
})();