// ==UserScript==
// @name         Anti Right-Click Hijaak
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  Prevent websites from hijaaking and preventing the browser right-click popup menu from appearing. This script should be applied to problematic websites only. Otherwise, the right-click popup menu on e.g. Google Drive won't work.
// @match        *://this.problematic.site/*
// @match        *://other-problematic.site/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382367/Anti%20Right-Click%20Hijaak.user.js
// @updateURL https://update.greasyfork.org/scripts/382367/Anti%20Right-Click%20Hijaak.meta.js
// ==/UserScript==

(() => {
  var ael = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(typ) {
    if (typ.toLowerCase() !== "contextmenu") return ael.apply(this, arguments);
  };
})();
