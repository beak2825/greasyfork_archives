// ==UserScript==
// @name         Dość nocnej
// @namespace    nocnassie
// @version      1.0.4
// @description  Skrypt ukrywający na Mikroblogu Wykop.pl wpisy dodane między godziną 1:00 a 6:00.
// @author       zranoI
// @include      /^https?:\/\/.*wykop\.pl\/mikroblog.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21800/Do%C5%9B%C4%87%20nocnej.user.js
// @updateURL https://update.greasyfork.org/scripts/21800/Do%C5%9B%C4%87%20nocnej.meta.js
// ==/UserScript==

$(document).ready(function() {
    const START_HIDING_HOUR = 1;
    const STOP_HIDING_HOUR = 6;
    
    $("li.iC").each(function() {
        var hourOfPostAddition = +/\d{4}\-\d{2}\-\d{2} (\d{2}):\d{2}:\d{2}/.exec($(this).find("time").attr("title"))[1];
       if (hourOfPostAddition >= START_HIDING_HOUR && hourOfPostAddition < STOP_HIDING_HOUR) {
           $(this).hide();
       }
    });
});