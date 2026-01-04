// ==UserScript==
// @name         Netflix AutoSkip
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  auto skip content
// @author       TANG Yanji
// @match        https://www.netflix.com/watch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491804/Netflix%20AutoSkip.user.js
// @updateURL https://update.greasyfork.org/scripts/491804/Netflix%20AutoSkip.meta.js
// ==/UserScript==

(function() {
    'use strict';

insertvalSkip = setInterval(() => {
    var elem = document.getElementsByClassName("watch-video--skip-content-button")
    if (elem.length > 0){
        elem[0].click()
        clearInterval(insertvalSkip)
    }
}, 1000);
})();