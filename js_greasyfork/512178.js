// ==UserScript==
// @name         Copy Paste Cut
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       Big watermelon
// @description  removes shits that prevent copy pasting on any site
// @match        *://*/*
// @license      GPL-3.0-or-later
// @icon         https://images.emojiterra.com/openmoji/v15.0/128px/2702.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512178/Copy%20Paste%20Cut.user.js
// @updateURL https://update.greasyfork.org/scripts/512178/Copy%20Paste%20Cut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.ClipboardEvent.prototype.preventDefault = () => {};
})();