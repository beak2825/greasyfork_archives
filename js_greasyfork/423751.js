// ==UserScript==
// @name         Jandan_Girl_No_Robot
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  煎蛋女装中隐藏来个C的发帖。
// @author       You
// @match        *://jandan.net/girl*
// @icon         http://cdn.jandan.net/static/img/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423751/Jandan_Girl_No_Robot.user.js
// @updateURL https://update.greasyfork.org/scripts/423751/Jandan_Girl_No_Robot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let tags = document.querySelectorAll('.commentlist li');
    for (let each of tags) {
        console.log(each);
        if (each.querySelector('.author strong').title.endsWith("03c4ab3f3654b12b4b7e8422d323f603dd88542a")) {
            each.style.display = "none";
        }
    };
})();