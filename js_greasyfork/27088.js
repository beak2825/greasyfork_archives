// ==UserScript==
// @name         Ricardo Guimaraes Munduruca Costa
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1-5 on top row selects bubbles and submits
// @author       pyro
// @match
// @include      *mturkcontent.com*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/27088/Ricardo%20Guimaraes%20Munduruca%20Costa.user.js
// @updateURL https://update.greasyfork.org/scripts/27088/Ricardo%20Guimaraes%20Munduruca%20Costa.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if ($('.panel-body:contains("Pick the best sentiment based on the following criterion")').length) {
        $('input[value="Strongly Positive"]').focus();
        $('.panel-primary').hide();
        document.onkeydown = function (e) {
            if (e.keyCode == 49) {                                   //1
                $("input[value='Strongly Negative']").click();
                $("#submitButton").click();
                console.log('Strongly Negative');
            }
            else if (e.keyCode == 50) {                              //2
                $("input[value='Negative']").click();
                $("#submitButton").click();
                console.log('Negative');
            }
            else if (e.keyCode == 51) {                              //3
                $("input[value='Neutral']").click();
                $("#submitButton").click();
                console.log('Neutral');
            }
            else if (e.keyCode == 52) {                              //4
                $("input[value='Positive']").click();
                $("#submitButton").click();
                console.log('Positive');
            }
            else if (e.keyCode == 53) {                              //5
                $("input[value='Strongly Positive']").click();
                $("#submitButton").click();
                console.log('Strongly Positive');
            }
        };
    }
})();