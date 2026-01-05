// ==UserScript==
// @name         Masters Sentiments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1-5 on top row selects bubbles and submits
// @author       pyro
// @match
// @include      *mturkcontent.com*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/24530/Masters%20Sentiments.user.js
// @updateURL https://update.greasyfork.org/scripts/24530/Masters%20Sentiments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("input[value='-2']").focus();
    document.onkeydown = function (e) {
        if (e.keyCode == 49) {                                   //1
            $("input[value='-2']").click();
            $("#submitButton").click();
        }
        else if (e.keyCode == 50) {                              //2
            $("input[value='-1']").click();
            $("#submitButton").click();
        }
        else if (e.keyCode == 51) {                              //3
            $("input[value='0']").click();
            $("#submitButton").click();
        }
        else if (e.keyCode == 52) {                              //4
            $("input[value='1']").click();
            $("#submitButton").click();
        }
        else if (e.keyCode == 53) {                              //5
            $("input[value='2']").click();
            $("#submitButton").click();
        }
    };
})();