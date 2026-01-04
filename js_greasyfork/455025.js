// ==UserScript==
// @name         iclicker monitor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dfghfgdhggh!
// @author       You
// @match        https://student.iclicker.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iclicker.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455025/iclicker%20monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/455025/iclicker%20monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let flag = true;
    new MutationObserver(() => {
        if(document.getElementById("multiple-choice-b") !== null){
        document.getElementById("multiple-choice-b").click();
            console.log("Answer clicked!!!!");
        }
        if(document.getElementsByClassName("join-title ng-binding")[0] !== undefined){
            if(document.getElementsByClassName("join-title ng-binding")[0].textContent.includes("Your instructor started class.")){
                document.getElementById("btnJoin").click();
                console.log("join class");
            }
        }
}).observe(document, {subtree: true, childList: true});

})();