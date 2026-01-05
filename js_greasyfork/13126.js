// ==UserScript==
// @name         Research Tasks - Rate Funniness of Scenarios
// @namespace    https://greasyfork.org/users/18161
// @version      1.1
// @description  Press 1-5 to rate.
// @author       Rusty
// @include      https://filebox*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/13126/Research%20Tasks%20-%20Rate%20Funniness%20of%20Scenarios.user.js
// @updateURL https://update.greasyfork.org/scripts/13126/Research%20Tasks%20-%20Rate%20Funniness%20of%20Scenarios.meta.js
// ==/UserScript==
// Special thanks to mturkmbison for fixing the last rating in the comment box issue! :)

if ($(":contains('how funny the given scenario is on a scale of')").length) {
    $("input[value='3']").focus();
    window.onkeyup = function(e) {
        if ((e.keyCode === 49) || (e.keyCode === 97)) { // 1 or Numpad1
            $("input[value='1']").click();
            $("input[id='nextButton']").click();
        }
        if ((e.keyCode === 50) || (e.keyCode === 98)) { // 2 or Numpad2
            $("input[value='2']").click();
            $("input[id='nextButton']").click();
        }
        if ((e.keyCode === 51) || (e.keyCode === 99)) { // 3 or Numpad3
            $("input[value='3']").click();
            $("input[id='nextButton']").click();
        }
        if ((e.keyCode === 52) || (e.keyCode === 100)) { // 4 or Numpad4
            $("input[value='4']").click();
            $("input[id='nextButton']").click();
        }
        if ((e.keyCode === 53) || (e.keyCode === 101)) { // 5 or Numpad5
            $("input[value='5']").click();
            $("input[id='nextButton']").click();
        }
    }
}