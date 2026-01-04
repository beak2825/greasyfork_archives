// ==UserScript==
// @name         Google redirect notice resolver
// @version      0.1
// @author       relayism
// @match        https://www.google.com/*
// @description  This script automatically resolves Google's redirect notice when using the "I am feeling lucky" url.
// @grant        none
// @namespace https://greasyfork.org/users/452041
// @downloadURL https://update.greasyfork.org/scripts/397558/Google%20redirect%20notice%20resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/397558/Google%20redirect%20notice%20resolver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var re_weburl = new RegExp(
        "^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$", "i"
    );

    const url = window.location.toString()
    const prefix = "https://www.google.com/url?q="
    if (url.startsWith(prefix)) {
        const targetUrl = url.substring(prefix.length)
        if (re_weburl.test(targetUrl)) {
            window.location = targetUrl
        }
    }
})();