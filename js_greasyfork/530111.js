// ==UserScript==
// @name         matemaks gwalcer
// @namespace    http://tampermonkey.net/
// @version      2025-03-17
// @description  bzikaj matemaksa az milo :)
// @author       You
// @match        https://www.matemaks.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=matemaks.pl
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530111/matemaks%20gwalcer.user.js
// @updateURL https://update.greasyfork.org/scripts/530111/matemaks%20gwalcer.meta.js
// ==/UserScript==

(function() {
    document.cookie += "premium_x02=1 ;expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=matemaks.pl; path=/"
    document.cookie += "premium_x02=1 ;expires=Fri, 31 Dec 9999 23:59:59 GMT; domain=www.matemaks.pl; path=/"
})();
