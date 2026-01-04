// ==UserScript==
// @name        Pixiv Twitter redirect fixer
// @namespace   Violentmonkey Scripts
// @include     /https?://(www.)?pixiv.net/(en/)?users/url=https://twitter.com/.*/
// @grant       none
// @version     1.0
// @author      RegexMC
// @description Fixes Pixiv user Twitter links not redirecting to Twitter
// @downloadURL https://update.greasyfork.org/scripts/427382/Pixiv%20Twitter%20redirect%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/427382/Pixiv%20Twitter%20redirect%20fixer.meta.js
// ==/UserScript==

window.location.replace("https://twitter.com/" + document.URL.split("/")[document.URL.split("/").length-1].trim());