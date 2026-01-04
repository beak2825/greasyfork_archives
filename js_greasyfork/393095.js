// ==UserScript==
// @name         Color Labels IntelSE
// @namespace    https://isvc.lightning.force.com/
// @version      1.1
// @description  Color label on dates
// @author       SB
// @match        https://isvc.lightning.force.com/lightning/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393095/Color%20Labels%20IntelSE.user.js
// @updateURL https://update.greasyfork.org/scripts/393095/Color%20Labels%20IntelSE.meta.js
// ==/UserScript==
var $ = window.jQuery;
$(document).ready(function() {
    function enable() {
        var visible = $('.uiVirtualDataTable', window.parent.document).is(":visible");
        function checkDates() {
            $('.listViewContent span[data-aura-class="uiOutputDateTime"]').each(function(i) {
                var time = $(this).text();
                var times = time.slice(0, -6);
                var from = times.split("/");
                var startDate = new Date(from[2], from[1] - 1, from[0]);
                var endDAte = new Date();
                var diff = new Date(startDate - endDAte);
                var days = diff / (1000 * 60 * 60 * 24);
                var daysRN = Math.ceil(days);
                var daysR = Math.abs(daysRN);
                var darkmode = $("style").hasClass("darkmode--user-agent");
                if (darkmode == true) {
                    if (daysR == 1) {
                        $(this).parent().parent().css("background", "blue");
                    } else if (daysR >= 3) {
                        $(this).parent().parent().css("background", "red");
                    } else if (daysR > 1) {
                        $(this).parent().parent().css("background", "yellow");
                    } else {
                        $(this).parent().parent().css("background", "green");
                    }
                } else {
                    if (daysR == 1) {
                        $(this).parent().parent().css("background", "#0000ff30");
                    } else if (daysR >= 3) {
                        $(this).parent().parent().css("background", "#ff000030");
                    } else if (daysR >= 2) {
                        $(this).parent().parent().css("background", "#ffff0030");
                    } else {
                        $(this).parent().parent().css("background", "#00800030");
                    }
                }
            });
        };
        if (visible == true) {
            setInterval(checkDates, 2000);
        } else {
            clearInterval(checkDates);
        }
    }
    setInterval(enable, 5000);
});