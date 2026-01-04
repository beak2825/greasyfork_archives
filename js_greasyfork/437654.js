// ==UserScript==
// @name         Unrated Then Rated
// @namespace    http://nahco314.com/
// @version      1.0
// @description  If you registered as unrated, you will be rated.
// @match        https://atcoder.jp/contests/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437654/Unrated%20Then%20Rated.user.js
// @updateURL https://update.greasyfork.org/scripts/437654/Unrated%20Then%20Rated.meta.js
// ==/UserScript==

(function() {
    let d = document.getElementsByClassName("btn btn-lg btn-default center-block mt-2").item(0);

    d.setAttribute("value", "true");

})()
