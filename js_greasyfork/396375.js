// ==UserScript==
// @name         Dinbendon auto answer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Auto fill answer when dinbendon login
// @author       Yich Lin
// @include        https://dinbendon.net/do/login*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/396375/Dinbendon%20auto%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/396375/Dinbendon%20auto%20answer.meta.js
// ==/UserScript==

(function() {
    var selector = "td.alignRight:contains('＝'),td.alignRight:contains('等於'),td.alignRight:contains('=')";
        waitForKeyElements(selector, calculateAnswer);
    function calculateAnswer(){
        var formula = $(selector).html();
        var reg = /(\d+).*(\d+)/g
        var match = reg.exec(formula);
        var answer = parseInt(match[1])+parseInt(match[2]);
        $("input[name='result']").val(answer);
    }
})();