// ==UserScript==
// @name         CurseForge Legacy Redirect
// @namespace    http://yournamespacehere/
// @version      1
// @description  Redirects from www.curseforge.com to legacy.curseforge.com
// @match        *://www.curseforge.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465196/CurseForge%20Legacy%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/465196/CurseForge%20Legacy%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.replace(window.location.href.replace('www.curseforge.com', 'legacy.curseforge.com'));
})();
