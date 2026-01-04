// ==UserScript==
// @name         YouTube Nocookie Redirect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirect youtube.com to yout-ube.com for videos
// @author       fdslalkad
// @match        https://www.youtube.com/watch*
// @match        https://youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540432/YouTube%20Nocookie%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/540432/YouTube%20Nocookie%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;

    if (url.includes('youtube.com/watch')) {
        const newUrl = url.replace('youtube.com', 'yout-ube.com');
        window.location.replace(newUrl);
    }
})();
