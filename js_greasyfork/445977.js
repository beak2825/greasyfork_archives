// ==UserScript==
// @name         SCP Foundation default logo
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Switches custom SCP logos (e.g. LGBT Pride) with the regular one.
// @author       Sickgum
// @match        *://scp-wiki.wikidot.com/*
// @icon         https://scp-wiki.wikidot.com/local--favicon/favicon.gif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445977/SCP%20Foundation%20default%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/445977/SCP%20Foundation%20default%20logo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        document.getElementsByTagName('head')[0].getElementsByTagName('style')[13].innerHTML = ('#header { background: url("https://scp-wiki.wdfiles.com/local--files/component:theme/logo.png") 15px 40px no-repeat !important; background-size: 6rem !important;}@media (max-width: 580px) and (min-width: 480px) { #header { background-position: 0.5em 4.5em  !important; background-size: 66px 66px  !important; }}@media (max-width: 479px) { #header { background-position: 0 5.5em !important; background-size: 55px 55px !important; }}');
        var header = document.getElementById("header");
        header.style.background= "url(/local--files/component:theme/logo.png) 10px 40px no-repeat !important";
        header.style.backgroundSize= "calc(48px + 5%)";
        header.style.backgroundPosition= "8px 64%";
    }, 0); // Delay of 0 seconds, why does this work?
})();