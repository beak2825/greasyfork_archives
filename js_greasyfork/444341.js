// ==UserScript==
// @name         Brave turn off safesearch when incognito
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Turn off safesearch in Brave search when incognito
// @author       Samis
// @match        https://search.brave.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brave.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444341/Brave%20turn%20off%20safesearch%20when%20incognito.user.js
// @updateURL https://update.greasyfork.org/scripts/444341/Brave%20turn%20off%20safesearch%20when%20incognito.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let ranOnce = document.cookie.search("ranOnce");

    if(GM_info.isIncognito && ranOnce == -1) {
       changeCookies();
    }

})();
function changeCookies() {
    let cookieValue = "off";
    document.cookie = "safesearch=" + cookieValue;
    document.cookie = "ranOnce=true"

    window.location.reload("true");
}