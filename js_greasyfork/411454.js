// ==UserScript==
// @name         Old Reddit Redirect
// @version      0.1
// @description  Redirect reddit to old.reddit
// @include      http://*.reddit.com/*
// @include      https://*.reddit.com/*
// @author       tlacuache
// @namespace https://greasyfork.org/users/688118
// @downloadURL https://update.greasyfork.org/scripts/411454/Old%20Reddit%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/411454/Old%20Reddit%20Redirect.meta.js
// ==/UserScript==

var url = window.location.host;

if (url.match("old.reddit") == null) {
    url = window.location.href;
    if  (url.match("//www.reddit") != null){
        url = url.replace("//www.reddit", "//old.reddit");
    } else if (url.match("//reddit.") != null){
        url = url.replace("//reddit.", "//old.reddit.");
    } else {
        return;
    }
    window.location.replace(url);
}