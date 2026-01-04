// ==UserScript==
// @name        Wanikani Auto-Override
// @namespace   wkautooverride
// @description Makes WaniKani ignore wrong answers, and adds them back to the queue.
// @include     https://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/lesson/session*
// @version     1.1.2
// @author      Robin Findley
// @copyright   2015+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/420205/Wanikani%20Auto-Override.user.js
// @updateURL https://update.greasyfork.org/scripts/420205/Wanikani%20Auto-Override.meta.js
// ==/UserScript==

window.auto_override = {};

(function(gobj) {

    /* globals $ */

    var auto_answer = true;
    var block = false;
    var reading_answer, meaning_answer;

    function addStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = css;
            head.appendChild(style);
            return style;
        }
        return null;
    }

    function ignore_wrong() {
        // Make sure the 'incorrect' class is set.
        if ($('#answer-form fieldset.incorrect').length <= 0) {
            return;
        }

        /* Grab information about current question */
        var curItem, questionType;
        if (window.location.pathname == '/lesson/session') {
            curItem = $.jStorage.get('l/currentQuizItem');
            questionType = $.jStorage.get('l/questionType');
        } else {
            curItem = $.jStorage.get('currentItem');
            questionType = $.jStorage.get('questionType');
        }

        /* Build item name */
        var itemName = '';
        if (window.location.pathname == '/lesson/session') itemName += 'l/stats/';
        if(curItem.rad) {
            itemName += 'r';
        } else if(curItem.kan) {
            itemName += 'k';
        } else {
            itemName += 'v';
        }

        itemName += curItem.id;

        // Grab item from jStorage.
        // item.rc and item.mc => Reading/Meaning Completed (if answered the item correctly)
        // item.ri and item.mi => Reading/Meaning Invalid (number of mistakes before answering correctly)
        var item = $.jStorage.get(itemName) || {};

        /* Update the item data */
        if(questionType === 'meaning') {
            if(!("mi" in item) || !item.mi || (item.mi <= 0)) return false;
            item.mi -= 1;
            delete item.mc;
        } else {
            if(!("ri" in item) || !item.ri || (item.ri <= 0)) return false;
            item.ri -= 1;
            delete item.rc;
        }

        /* Save the new state back into jStorage */
        $.jStorage.set(itemName, item);

        /* Modify the questions counter and wrong counter and change the style of the answer field */
        var wrongCount, questionCount;
        if (window.location.pathname != '/lesson/session') {
            wrongCount = $.jStorage.get('wrongCount');
            questionCount = $.jStorage.get('questionCount');

            $.jStorage.set("wrongCount", wrongCount-1);
            $.jStorage.set("questionCount", questionCount-1);
        }

        $("#answer-form fieldset").removeClass("incorrect");
        $("#answer-form fieldset").addClass("WKAO_ignore");
    }
    window.ignore_wrong = ignore_wrong;

    function install() {
/*
        if (answerChecker) {
            var old_eval = answerChecker.evaluate;
            answerChecker.evaluate = function(e,t){
                var ret = old_eval(e,t);
                setTimeout(ignore_wrong, 50);
                return ret;
            };
            $('#user-response').on('keydown.wkao',function(e){
                if ($("#reviews").is(":visible") && $('#user-response:focus').length <= 0) {
                    if (e.keyCode == 192) {
                        ignore_wrong();
                    }
                }
            });
        } else {
            $('#user-response').on('keydown.wkao',function(e){
                if ($('#user-response:focus').length > 0 && e.keyCode == 13) {
                    setTimeout(function(){
                        ignore_wrong();
                    }, 100);
                }
                else if ($("#reviews").is(":visible")) {
                    if (e.keyCode == 192) {
                        ignore_wrong();
                    }
                }
            });
        }
*/
        if (window.location.pathname == '/lesson/session') {
            $.jStorage.listenKeyChange('l/currentQuizItem', reveal);
        } else {
            $.jStorage.listenKeyChange('currentItem', reveal);
        }
        reveal();
    }

    function reveal() {
        var key, qtype, stype;
        console.clear();
        if (window.location.pathname == '/lesson/session') {
            key = $.jStorage.get('l/currentQuizItem');
            qtype = $.jStorage.get('l/questionType');
            stype = qtype;
        } else {
            key = $.jStorage.get('currentItem');
            qtype = $.jStorage.get('questionType');
            stype = 'both';
        }
        if (key === null) return;
        var type=(key.kan !== undefined ? 'k' : (key.voc !== undefined ? 'v' : 'r'));
        var em = (key.emph=='onyomi'?'on':(key.emph=='kunyomi'?'kun':'nanori'));
        switch(type) {
            case 'k':
                if (stype == 'reading' || stype == 'both') {
                    console.log('Reading: '+key[em].join(', '));
                    reading_answer = key[em][0];
                }
                if (stype == 'meaning' || stype == 'both') {
                    console.log('Meaning: '+key.en.join(', '));
                    meaning_answer = key.en[0];
                }
                break;
            case 'v':
                if (stype == 'reading' || stype == 'both') {
                    console.log('Reading: '+key.kana.join(', '));
                    reading_answer = key.kana[0];
                }
                if (stype == 'meaning' || stype == 'both') {
                    console.log('Meaning: '+key.en.join(', '));
                    meaning_answer = key.en[0];
                }
                break;
            case 'r':
//                if (stype == 'reading' || stype == 'both')
                    console.log('Reading: ---');
//                if (stype == 'meaning' || stype == 'both')
                    console.log('Meaning: '+key.en.join(', '));
                    meaning_answer = key.en[0];
                break;
        }
        if (auto_answer) {
            setTimeout(function(){
                var answer = (qtype === 'reading' ? reading_answer : meaning_answer);
                $('#user-response')[0].value = answer;
                if (block) return;
                block = true;
                setTimeout(function(){
                    $('#answer-form button').click();
                    setTimeout(function(){
                        $('#answer-form button').click();
                        block = false;
                    }, 100);
                }, 200);
            }, 200);
        }
    }

    function main() {
        addStyle('#answer-form fieldset.WKAO_ignore button, #answer-form fieldset.WKAO_ignore input[type=text], #answer-form fieldset.WKAO_ignore input[type=text]:disabled {background-color:#ff8800 !important; color:#ffffff !important}');

        setTimeout(install, 1000);
    }

    // Run main upon load.
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener("load", main, false);
    }

})(window.auto_override);
