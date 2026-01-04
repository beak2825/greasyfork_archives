// ==UserScript==
// @name         f**k off shorts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将YouTube短视频重定向到普通网页
// @description  Redirect YouTube short video to normal web page
// @author       sqhl
// @license      MIT
// @match        https://www.youtube.com/shorts/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460080/f%2A%2Ak%20off%20shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/460080/f%2A%2Ak%20off%20shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var youtubeLocale = new RegExp(/(?:youtu\.be\/|youtube\.com(?:\/shorts\/))([\w\-]{10,12})\b/)
    var url = window.location.href;
    if (youtubeLocale.test(url)) {
        var host = window.location.host;
        // var videoId = host.split('shorts')[1];
        window.location.replace(url.replace('https://www.youtube.com/shorts/', 'https://www.youtube.com/watch?v='));
    }
})();

