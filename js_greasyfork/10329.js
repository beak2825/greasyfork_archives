// ==UserScript==
// @name        Rotten Tomatoes Reviews Redirect
// @namespace   https://github.com/soyguijarro/userscripts
// @description Redirects movie pages to their corresponding reviews pages
// @copyright   2015, Ramón Guijarro (http://soyguijarro.com)
// @homepageURL https://github.com/soyguijarro/userscripts
// @supportURL  https://github.com/soyguijarro/userscripts/issues
// @icon        https://raw.githubusercontent.com/soyguijarro/userscripts/master/img/rotten_tomatoes_icon.png
// @license     GPLv3; http://www.gnu.org/licenses/gpl.html
// @version     1.1
// @include     *://www.rottentomatoes.com/m/*
// @include     *://www.rottentomatoes.com/m/*/reviews/*
// @run-at      document-start
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10329/Rotten%20Tomatoes%20Reviews%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/10329/Rotten%20Tomatoes%20Reviews%20Redirect.meta.js
// ==/UserScript==

var reviewsPageMatch = /reviews(\/\?type=(\w+))*/.exec(window.location);

if (reviewsPageMatch) { // Save current reviews type
    localStorage.reviewType = reviewsPageMatch[2] || "";
} else {    // Redirect to reviews page
    window.location.replace(window.location.toString().replace(/\/$/, "") +
        "/reviews/?type=" + (localStorage.reviewType || ""));
}