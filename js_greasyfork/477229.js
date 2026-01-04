// ==UserScript==
// @name        Redirect YouTube Shorts to normal video
// @description Redirects from https://www.youtube.com/shorts/ID to corresponding https://www.youtube.com/watch?v=ID page
// @include     https://www.youtube.com/*
// @namespace   https://greasyfork.org/users/8233
// @license MIT
// @version 0.0.2
// @downloadURL https://update.greasyfork.org/scripts/477229/Redirect%20YouTube%20Shorts%20to%20normal%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/477229/Redirect%20YouTube%20Shorts%20to%20normal%20video.meta.js
// ==/UserScript==
window.setInterval(function() {
    if (window.location.href.indexOf('/shorts/') !== -1) {
        var newurl = window.location.href.replace('https://www.youtube.com/shorts/', 'https://www.youtube.com/watch?v=');
        if (newurl !== window.location.href)
            window.location.href = newurl;
    }
}, 500);