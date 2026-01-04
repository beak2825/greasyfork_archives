// ==UserScript==
// @name         Prevent YouTube Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect YouTube URLs to .com. to prevent ads
// @author       Sirfredrick
// @match        https://www.youtube.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405703/Prevent%20YouTube%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/405703/Prevent%20YouTube%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
  const url = window.location.href;

    if (!url.includes(".com.")) {
        const first = url.split(".com")[0];
        const second = url.split(".com")[1];
        const newUrl = first + ".com." + second;
        console.log(url);
        console.log(newUrl);
        window.location.replace(newUrl);
    }
})();