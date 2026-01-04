// ==UserScript==
// @name         Bing to Google
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically redirects Bing searches to Google.
// @author       Sev
// @include      https://www.bing.com/search*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33907/Bing%20to%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/33907/Bing%20to%20Google.meta.js
// ==/UserScript==

location.href = location.href.replace('bing', 'google');