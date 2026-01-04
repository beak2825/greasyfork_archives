// ==UserScript==
// @name         UI/UX Fixes [nit.school]
// @namespace    https://app.nit.school/
// @version      0.1
// @description  Script for fixing bad UI/UX decisions on the website nit.school.
// @author       Relitrix (Stanislav Strilets)
// @match        https://app.nit.school/diary
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nit.school
// @grant        none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456912/UIUX%20Fixes%20%5Bnitschool%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/456912/UIUX%20Fixes%20%5Bnitschool%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function move_task() {
        let list = document.getElementsByTagName("img");
        for (let item of list) {
            if (item.src.match("paragraph")) {
                item.parentElement.parentElement.innerHTML += "<span style='font-weight:normal'>" + item.title;
                item.style.display = "None";
            }
        }
        for (let img of list) {img.style.maxWidth = "fit-content"}
    }
    setTimeout(move_task, 8000)
})();