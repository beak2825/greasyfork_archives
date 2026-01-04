// ==UserScript==
// @name         Following by default
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Just makes "Following" the default home tab on Twitter
// @author       RedRiolite
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458603/Following%20by%20default.user.js
// @updateURL https://update.greasyfork.org/scripts/458603/Following%20by%20default.meta.js
// ==/UserScript==

(function() {
    if (window.location.href === "https://twitter.com/home"){
        const CHECK = setInterval(() => {
            var tabs = document.querySelectorAll('[role="tab"][href="/home"]');
            if (tabs != undefined && tabs.length == 2){
                tabs[1].click();
                clearInterval(CHECK);
            }}, 1500);
    }
})();