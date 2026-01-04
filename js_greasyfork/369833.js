// ==UserScript==
// @name         Old Reddit
// @namespace    https://greasyfork.org/users/154522
// @version      1.0
// @description  Use old reddit site
// @author       G-Rex
// @match        https://www.reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/369833/Old%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/369833/Old%20Reddit.meta.js
// ==/UserScript==

(function() {
    window.location.href = window.location.href.replace(/www/, 'old');
})();