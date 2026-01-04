// ==UserScript==
// @name         schoolparrot.se unlock premium reviews
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  unlock premium reviews on School Parrot (schoolparrot.se)
// @author       stennen
// @match        *.schoolparrot.se/schools/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481013/schoolparrotse%20unlock%20premium%20reviews.user.js
// @updateURL https://update.greasyfork.org/scripts/481013/schoolparrotse%20unlock%20premium%20reviews.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout((function() {
        setInterval((function() {
            let els = document.getElementsByClassName("content-box review locked")

            for (let i =0; i < els.length;i++) {
                els[i].setAttribute("class", "content-box review");
            }

            els = document.getElementsByClassName("btn-blue btn-locked");

            for (let i = 0; i < els.length; i++) {
                els[i].remove();}
        }), 1000)}), 1500);

})();