// ==UserScript==
// @name         Gamedrive & Crypt Auto Ad Blocker
// @namespace    https://cybar.xyz/
// @version      1.1
// @description  Automatically sets a cookie to disable ads on Gamedrive.org and crypt.cybar.xyz
// @author       You
// @match        https://gamedrive.org/*
// @match        https://crypt.cybar.xyz/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530553/Gamedrive%20%20Crypt%20Auto%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/530553/Gamedrive%20%20Crypt%20Auto%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    document.cookie = "ads=off; path=/; max-age=" + Number.MAX_SAFE_INTEGER;
})();