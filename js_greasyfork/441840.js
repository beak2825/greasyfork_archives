// ==UserScript==
// @name         Test 1
// @namespace    https://www.pornhub.com/
// @version      1.0.0
// @description  Eats your firstborn.
// @author       Me
// @match        https://*.pixiv.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441840/Test%201.user.js
// @updateURL https://update.greasyfork.org/scripts/441840/Test%201.meta.js
// ==/UserScript==

SetCookie();

function SetCookie() {
    (function () {
        document.cookie = "PHPSESSID=33562155_v18RYKmAPN81BiT9jmZ10fs6ZsJ5m387;path=%2F;expires=Tue, 19 January 2038 00:00:00 GMT;domain=.pixiv.net";
    })();
}
