// ==UserScript==
// @namespace    papafru
// @name         Efood Category Itemz
// @version      1.2
// @description  Posa noumerakia?
// @author       papafru
// @match        https://www.e-food.gr/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-food.gr
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/447096/Efood%20Category%20Itemz.user.js
// @updateURL https://update.greasyfork.org/scripts/447096/Efood%20Category%20Itemz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    docReady(function() {
        $("#shop-profile-menu-list-nav2 li").each(function(i, el) {
            var items = $(this).attr("data-section-items");
            var span = $("<span>/<span>").text("("+items+")");
            span.css("font-weight", "bold");
            var a = $(this).find("a");
            a.append(span);
        });
    });


})();