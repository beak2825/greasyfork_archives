// ==UserScript==
// @name         DataCamp UnBlocker
// @namespace    DataCamp UnBlocker
// @version      0.3
// @description  Unblock datacamp.com
// @author       Me
// @match        https://*.datacamp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381011/DataCamp%20UnBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/381011/DataCamp%20UnBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var sheet = (function () {
        var style = document.createElement("style");

        // WebKit hack :(
        style.appendChild(document.createTextNode(""));

        // Add the <style> element to the page
        document.head.appendChild(style);

        return style.sheet;
    })();
    sheet.insertRule(".modal-backdrop { display: none !important; }", 0);
    sheet.insertRule(".modal-window { pointer-events: none !important; }", 0);
    sheet.insertRule(".modal-dialog { border: 1px grey solid; pointer-events: all !important; }", 0);
    sheet.insertRule("#fake { display: none !important; }", 0);
    sheet.insertRule("#iframe-modal { display: none !important; }", 0);
})();