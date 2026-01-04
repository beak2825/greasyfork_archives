// ==UserScript==
// @name         JIRA Color Cards
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Increase Visibility of Rapid Board Cards in JIRA
// @author       Amit Velingkar
// @include      https://*/RapidBoard.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401358/JIRA%20Color%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/401358/JIRA%20Color%20Cards.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    $.noConflict();
    $(document).ready(function (){
        $("head").append("<style>" +
            ".ghx-issue-compact .ghx-end { background-color: rgba(0,0,0,0) !important; }" +
            ".ghx-selected { border: 2px solid #999 !important; margin-bottom: 2px !important;}" +
            ".ghx-issue-compact > .ghx-issue-content {display: flex;}"+
            ".ghx-issue-compact .ghx-plan-extra-fields {color: #999; margin-left: 10px !important; min-width: 0em !important;}"+
            ".ghx-issue-compact .ghx-plan-extra-fields .ghx-extra-field {min-width: 0 !important;}"+
        "</style>");


        document.addEventListener("DOMNodeInserted", function (e) {
            $('.ghx-grabber').each(function () {
                // change color of cards
                if ($(this).css('background-color') && $(this).css('background-color') != "rgb(238, 238, 238)") {
                    $(this).parent().css('background-color', $(this).css('background-color').replace(')', ', 0.15)').replace('rgb', 'rgba'));
                } else {
                    $(this).parent().css('background-color', 'rgba(255, 255, 255, 0.15)');
                }

                // add hover effect
                $(this).parent().hover(function(){
                    $(this).css('background-color', $(this).css('background-color').replace(', 0.15)', ', 0.25)'));
                    $(this).css('background-color', $(this).css('background-color').replace('255, 255, 255,', '238, 238, 238,'));
                },function(){
                    $(this).css('background-color', $(this).css('background-color').replace(', 0.25)', ', 0.15)'));
                    $(this).css('background-color', $(this).css('background-color').replace('238, 238, 238,', '255, 255, 255,'));
                });
            });
        }, false);
    });
})();