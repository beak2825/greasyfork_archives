// ==UserScript==
// @name         Lesson Remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Removes the Lessons number on Wanikani when the lowest item percentage is lower than 75%.
// @author       Sinom
// @match        https://www.wanikani.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392427/Lesson%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/392427/Lesson%20Remover.meta.js
// ==/UserScript==

(function() {

    let lowestPercentage = $('.low-percentage.kotoba-table-list table td span.pull-right').html();
    if (lowestPercentage != null){
        if (Number(lowestPercentage.substring(0,1))<75) {
            replace();
        }
    }
    function replace() {
        let row = $('.recent-unlocks').closest(".row");
        $('.navigation-shortcut:first-child a span').html('0');
        $('.navigation-shortcut:first-child a span').css('background', '#aaa');
        $('.recent-unlocks').parent().css("display", "none");
        $('.low-percentage').parent().addClass("span6");
        $('.recent-retired').parent().addClass("span6");
        console.log($('.recent-unlocks').closest(".row"));
    }
})();