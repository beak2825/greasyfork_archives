// ==UserScript==
// @name         telToGVConnect
// @namespace    http://visideas.com/
// @version      0.1
// @description  Convert tel: links to gvconnect:// format
// @author       David Morlitz
// @include      *
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435915/telToGVConnect.user.js
// @updateURL https://update.greasyfork.org/scripts/435915/telToGVConnect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var anchors = document.getElementsByTagName("a");
    for (var i = 0; i < anchors.length; i++) {
        var oldhref=anchors[i].href;
        if (oldhref.substr(0,4)=='tel:') {
           anchors[i].href=oldhref.replace(/tel:/g, 'gvconnect://call?callmethod=DirectCall&number=');
        }
    }
})();