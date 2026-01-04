// ==UserScript==
// @name         v2ex-removebg
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove background image.
// @author       6david9
// @match        https://*.v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480608/v2ex-removebg.user.js
// @updateURL https://update.greasyfork.org/scripts/480608/v2ex-removebg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* globals jQuery, $, waitForKeyElements */

    const elem = document.querySelector("#Wrapper");
    elem.style.backgroundColor = "#dee";
    elem.style.backgroundRepeat = "no-repeat";
    elem.style.backgroundImage = 'none';

    $("#Rightbar > div:nth-child(3)").css({"display": "none"});
    $("#Rightbar > div:nth-child(4)").css({"display": "none"});
    $(".wwads-cn").css({"display": "none"});
})();