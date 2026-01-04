// ==UserScript==
// @name         Battlefy Ongoing Counter
// @namespace    https://battlefy.com/
// @version      0.1.1
// @description  Count how many matches are still going on
// @author       Toka-MK
// @match        https://battlefy.com/*/bracket/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.5.0.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/402000/Battlefy%20Ongoing%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/402000/Battlefy%20Ongoing%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {

        setTimeout(function() {
            var count = 0;
            var htmlCollection = document.getElementsByClassName("td-result");
            var array = [].slice.call(htmlCollection);
            for (var i = 0; i < array.length; i++) {
                if (array[i].textContent.trim().replace(/(\r\n|\n|\r| )/gm, "").includes("-:-")) {
                    count++;
                }
            }
            array[0].textContent = count + "/" + (array.length - 1);

        }, 5000);

    });

})();