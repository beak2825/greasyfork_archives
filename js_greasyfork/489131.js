// ==UserScript==
// @name         UNSW Library Redirect
// @name:zh-CN   UNSW Library Redirect
// @namespace    https://github.com/yujianke100/University-Library-Redirect/tree/UNSW
// @version      1.1.5
// @description  Automatically redirect from ACM, IEEE, Springer and ScienceDirect to UNSW Library.
// @description:zh-CN 自动从ACM、IEEE、Springer和ScienceDirect重定向到新南威尔士大学图书馆。
// @author       Jianke Yu
// @match        https://dl.acm.org/*
// @match        https://ieeexplore.ieee.org/*
// @match        https://link.springer.com/*
// @match        https://www.sciencedirect.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489131/UNSW%20Library%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/489131/UNSW%20Library%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentURL = window.location.href;
    var newURL;
    var proxySuffix = ".wwwproxy1.library.unsw.edu.au";

    // Function to check if the URL has already been redirected
    function isRedirected(url) {
        return url.includes(proxySuffix) || url.includes("redirected=true") || url.includes("%3Fredirected%3Dtrue") || url.includes("arnumber=");
    }

    if (!isRedirected(currentURL)) {
        if (currentURL.startsWith("https://dl.acm.org/")) {
            newURL = currentURL.replace("https://dl.acm.org/", "https://dl-acm-org" + proxySuffix + "/") + "?redirected=true";
        } else if (currentURL.startsWith("https://ieeexplore.ieee.org/")) {
            newURL = currentURL.replace("https://ieeexplore.ieee.org/", "https://ieeexplore-ieee-org" + proxySuffix + "/") + "?redirected=true";
        } else if (currentURL.startsWith("https://link.springer.com/")) {
            newURL = currentURL.replace("https://link.springer.com/", "https://link-springer-com" + proxySuffix + "/") + "?redirected=true";
        } else if (currentURL.startsWith("https://www.sciencedirect.com/")) {
            newURL = currentURL.replace("https://www.sciencedirect.com/", "https://www-sciencedirect-com" + proxySuffix + "/") + "?redirected=true";
        }

        if (newURL) {
            window.location.href = newURL;
        }
    }
})();