// ==UserScript==
// @name         Edit Everything
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Edit every webpage
// @include      *
// @author       You
// @match        https://www.google.com/search?q=tampermonkey+autocorrect&safe=active&scrlybrkr=c4613652
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377784/Edit%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/377784/Edit%20Everything.meta.js
// ==/UserScript==

(function() {
    'use strict';

    javascript:document.body.contentEditable = 'true'; document.designMode='on'; void 0
})();