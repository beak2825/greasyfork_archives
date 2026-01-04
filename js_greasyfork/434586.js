// ==UserScript==
// @name         Incognito Bing open links in the same tab by default
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  When incognito, Bing opens links in the same tab by default.
// @author       Samis
// @match        https://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?domain=bing.com
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/434586/Incognito%20Bing%20open%20links%20in%20the%20same%20tab%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/434586/Incognito%20Bing%20open%20links%20in%20the%20same%20tab%20by%20default.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(GM_info.isIncognito && !sessionStorage.getItem("ranOnce"))
       changeCookies();

})();
function changeCookies() {
    let cookieValue = "&EXLKNT=0";
    document.cookie = "SRCHHPGUSR=" + cookieValue;
    window.location.reload("true");

    sessionStorage.setItem("ranOnce", "true");
}