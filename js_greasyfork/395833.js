// ==UserScript==
// @name         NovelUpdates Only JP
// @namespace    NovelUpdatesOnlyJP
// @version      1.0
// @description  Leaves only JP novels on the front page.
// @author       JuuzaAmakusa
// @match        https://novelupdates.com/
// @match        https://www.novelupdates.com/
// @match        http://novelupdates.com/
// @match        http://www.novelupdates.com/
// @match        https://novelupdates.com/?pg=*
// @match        https://www.novelupdates.com/?pg=*
// @match        http://novelupdates.com/?pg=*
// @match        http://www.novelupdates.com/?pg=*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/395833/NovelUpdates%20Only%20JP.user.js
// @updateURL https://update.greasyfork.org/scripts/395833/NovelUpdates%20Only%20JP.meta.js
// ==/UserScript==
(function () {
    "use strict";
    if (typeof window.orientation !== 'undefined')
    {
        var series_list = document.querySelectorAll("table.tbl_m_release > tbody > tr > td > a:not([class])");
        [].forEach.call(series_list, function(series) {
            var is_japanese = series.parentNode.querySelector("span.orgjp");
            if (!is_japanese) {
                series.parentNode.parentNode.remove();
            }
            else {
                series.parentNode.querySelector("span.orgjp").remove();
                series.style.paddingLeft = "30px";
            }
        });
    }
    else {
        var series_list = document.querySelectorAll("table#myTable > tbody > tr > td[class] > a");
        [].forEach.call(series_list, function(series) {
            var is_japanese = series.parentNode.querySelector("span.orgjp");
            if (!is_japanese) {
                series.parentNode.parentNode.remove();
            }
            else {
                series.parentNode.querySelector("span.orgjp").remove();
                series.style.paddingLeft = "30px";
            }
        });
    }
})();