// ==UserScript==
// @name        Wanikani Mistake Delay
// @namespace   wkmistakedelay
// @description Adds a delay after wrong answers to prevent double-tapping <enter>
// @include     https://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/lesson/session*
// @version     2.1.1
// @author      Robin Findley
// @copyright   2017+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34235/Wanikani%20Mistake%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/34235/Wanikani%20Mistake%20Delay.meta.js
// ==/UserScript==

window.wkmistakedelay = {};

(function(gobj) {

    //==[ Settings ]=====================================================
    var settings = {

        // Amount of time to delay (in milliseconds).
        delay_period: 2000,

        // Delay when answer is slightly off (e.g. minor typo).
        delay_slightly_off: 1,

        // Delay when multiple answers are available.
        delay_multiple: 1
    };
    //===================================================================

    // The amount of time to disable 2nd <enter> after a mistake (in milliseconds).
    var old_submit_handler, old_answer_checker, ignore_submit = false;

    function new_answer_checker() {
        // Call the original answer checker.
        var result = old_answer_checker.apply(this, arguments);

        // Check if we have any reason to delay.
        var delay = false;
        if ((!result.passed && !result.exception) || (settings.delay_multiple && result.multipleAnswers))
            delay = true;

        // Perform a delayed check to see if the answer exception message pops up.
        if (!delay && settings.delay_slightly_off) {
            setTimeout(function(){
                if (($('#answer-exception').length > 0) && ($('#answer-exception').text().match(/a bit off/) !== null)) {
                    console.log('Delaying due to "a bit off"');
                    do_delay();
                }
            }, 1);
        }

        // Initiate the delay if needed.
        if (delay) do_delay();

        function do_delay() {
            console.log('Delaying...');
            ignore_submit = true;
            setTimeout(function() {
                ignore_submit = false;
                $('#user-response').attr('disabled','disabled');
            }, settings.delay_period);
        }

        return result;
    }

    function new_submit_handler(e) {
        if (ignore_submit) return false;
        return old_submit_handler.apply(this, arguments);
    }

    function startup() {
        // Check if we can intercept the submit button handler.
        try {
            old_submit_handler = $._data( $('#answer-form button')[0], 'events').click[0].handler;
            old_answer_checker = answerChecker.evaluate;
        } catch(err) {
        }
        if (typeof old_submit_handler !== 'function' || typeof old_answer_checker !== 'function') {
            alert('Wanikani Mistake Delay script is not working.');
            return;
        }

        // Replace the handlers.
        $._data( $('#answer-form button')[0], 'events').click[0].handler = new_submit_handler;
        answerChecker.evaluate = new_answer_checker;
    }

    // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup, false);

})(window.wkselfstudy);
