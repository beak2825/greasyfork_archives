// ==UserScript==
// @name         Pinterest middle click open image in new tab
// @namespace    FuckPinterest
// @version      0.6
// @description  Fixes pinterest middle click open image in new tab
// @author       codingjoe
// @match        *.pinterest.*
// @include      /pinterest/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/39899/Pinterest%20middle%20click%20open%20image%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/39899/Pinterest%20middle%20click%20open%20image%20in%20new%20tab.meta.js
// ==/UserScript==

// dollar sign alias the querySelectorAll function
var $ = function (inpt) {
    return document.querySelectorAll(inpt);
};

(function() {
    'use strict';
    document.addEventListener("click", function(e){ e.button===1 && e.stopPropagation(); }, true);

    window.addEventListener("mousemove", function (e) {
        var element = e.target;

        while (element !== null && element.tagName !== undefined && element.tagName.toString().toLowerCase() !== "a") {
            element = element.parentNode;
        }

        if (element !== null && element.tagName !== undefined && element.tagName.toString().toLowerCase() === "a") {
            element.style.cursor = "pointer";
        }
    });
})();