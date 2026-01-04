// ==UserScript==
// @name         ZZZ autoDownload
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Anxietier
// @match        *www.zzzpan.com/?/file/view-*
// @match        *zz.52kbd.com/?/file/view-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371266/ZZZ%20autoDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/371266/ZZZ%20autoDownload.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Url = (document.querySelectorAll('.downSite a'))[0].href;
    window.location.href=Url;
    window.setTimeout(function() { self.close() }, 3000);
})();