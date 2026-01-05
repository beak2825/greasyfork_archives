// ==UserScript==
// @name         Sergey Schmidt Search Query
// @version      1.0
// @namespace    http://tampermonkey.net/
// @description  Hides instuctions, top row 1-5 for select button/submit
// @author       pyro
// @include      *www.mturkcontent.com*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/24168/Sergey%20Schmidt%20Search%20Query.user.js
// @updateURL https://update.greasyfork.org/scripts/24168/Sergey%20Schmidt%20Search%20Query.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($(".list-header:contains('Degrees of Relevance (How good is the Search Result')").length) {
       console.log('Sergey Schmidt Rate a TV Show');
        $("#please-note").hide();
        $("#instructions").hide();
        $("#sample-task").hide();
        document.onkeydown = function (e) {
            if (e.keyCode == 49) {                              //1
                $("input[value='Exact Match']").click();
                $("#submitButton").click();
            }
            if (e.keyCode == 50) {                              //2
                $("input[value='Relevant, but NOT Exact Match']").click();
                $("#submitButton").click();
            }
            if (e.keyCode == 51) {                              //3
                $("input[value='Related, but NOT Relevant']").click();
                $("#submitButton").click();
            }
            if (e.keyCode == 52) {                              //4
                $("input[value='Neither Relevant, nor Related']").click();
                $("#submitButton").click();
            }
            if (e.keyCode == 53) {                              //5
                $("input[value='Spam/Inappropriate content']").click();
                $("#submitButton").click();
            }
        };
    }
})();