// ==UserScript==
// @name          All text editable
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   WARNING! MAKES MOST PAGES LIKE YOUTUBE AND OTHER VIDEO WATCHING SITES BUGGY, AS MOST LETTERS ARE USED AS KEYBINDS
// @match         *://*/*
// @grant         none
// @license The Unlicense
// @downloadURL https://update.greasyfork.org/scripts/481620/All%20text%20editable.user.js
// @updateURL https://update.greasyfork.org/scripts/481620/All%20text%20editable.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.contentEditable = true;
})();