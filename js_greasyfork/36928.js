// ==UserScript==
// @name         Don't Fuck With Paste
// @namespace    DontFuckWithPaste@NeckBeardedDragon
// @version      0.1
// @description  Paste in any input field! Don't let stupid web design stop you. Code "borrowed" from the "Don't Fuck With Paste" webextension by Aaron Raimist
// @author       NeckBeardedDragon
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36928/Don%27t%20Fuck%20With%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/36928/Don%27t%20Fuck%20With%20Paste.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const exclude = `https?://.*?\.facebook\.com/.*
https?://.*?\.messenger\.com/.*
https?://.*?.google.com/.*
https?://.*?.?github.com/.*
https?://imgur.com/.*`;
    const include =`.*`;

    const allowCopyAndPaste = function(e) {
        e.stopImmediatePropagation();
        return true;
    };
    const excludes = new RegExp(exclude.split('\n').join('|'));
    const includes = new RegExp(include.split('\n').join('|'));
    const location = window.location.href;
    if (includes.test(location) && !excludes.test(location)) {
        document.addEventListener('copy', allowCopyAndPaste, true);
        document.addEventListener('paste', allowCopyAndPaste, true);
    }

})();