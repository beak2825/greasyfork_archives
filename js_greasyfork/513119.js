// ==UserScript==
// @name         Disable Youtube playlist autoplay
// @version      2024-10-19
// @description  Remove list params on URL and redirect. so that would not auto play next video when finish
// @author       Pakr
// @match        https://www.youtube.com/watch?*&list=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1382959
// @downloadURL https://update.greasyfork.org/scripts/513119/Disable%20Youtube%20playlist%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/513119/Disable%20Youtube%20playlist%20autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = location.href;
    var newurl = url.substring(0, url.search("&list="));
    location.replace(newurl);
})();