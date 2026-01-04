// ==UserScript==
// @name         Adom Wiki map fix
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description      Fixes the map layout being broken on the wiki
// @author       You
// @match        https://ancardia.fandom.com/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=fandom.com
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426301/Adom%20Wiki%20map%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/426301/Adom%20Wiki%20map%20fix.meta.js
// ==/UserScript==
GM_addStyle(`
.map span {
  width: 9px;
  height: 9px;
  display: inline-block;
 }
`);
(function() {
    'use strict';

    // Your code here...
})();