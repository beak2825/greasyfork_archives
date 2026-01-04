// ==UserScript==
// @name         Fanfiction.net - Force Desktop Mode
// @namespace    http://fanfiction.net/
// @version      0.2
// @description  Automatically redirect from m.fanfiction.net to the desktop site.
// @author       You
// @match        https://m.fanfiction.net/*
// @icon         https://www.fanfiction.net/static/images/favicon_2010_site.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437478/Fanfictionnet%20-%20Force%20Desktop%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/437478/Fanfictionnet%20-%20Force%20Desktop%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    location.replace(location.href.replace(/https?:\/\/m./i, "https://"))
})();