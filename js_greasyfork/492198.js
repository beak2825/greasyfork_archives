// ==UserScript==
// @name         Imgur WebArchive redirect on 404
// @namespace    http://tampermonkey.net/
// @version      2024-04-11
// @description  Detect a 404 page at imgur.com and redirect it to web.archive.org in hopes that it is stored there
// @author       VinniTheP00h
// @match        imgur.com/error/404
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/492198/Imgur%20WebArchive%20redirect%20on%20404.user.js
// @updateURL https://update.greasyfork.org/scripts/492198/Imgur%20WebArchive%20redirect%20on%20404.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = window.frames.top.document.referrer;
    var arch = "https://web.archive.org/" + url;
    document.location = arch;
})();