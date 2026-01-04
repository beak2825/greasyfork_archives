// ==UserScript==
// @name         Youtube-Deleter
// @namespace    http://tampermonkey.net/
// @version      2024-03-02
// @description  Deletes whole mobile page of youtube
// @author       You
// @match        https://m.youtube.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488786/Youtube-Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/488786/Youtube-Deleter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let quote = "GO DO THE RUST LAB(DS PRACTICALS) PROJECT PLEASE BRUV STOP LOOKING REDDIT BRUV";
    setInterval(function(){
        const wholePage = document.querySelector(".page-container");
        wholePage.remove();
    },100);

})();