// ==UserScript==
// @name         Remember itstoohard tries
// @description  Shows all attempted tries for all questions so you know what you already tried.
// @author       Bladito
// @version      0.2
// @match        http://www.itstoohard.com/puzzle/*
// @namespace    Bladito/itstoohard-tries
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21421/Remember%20itstoohard%20tries.user.js
// @updateURL https://update.greasyfork.org/scripts/21421/Remember%20itstoohard%20tries.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var storageName = 'Bladito_ith_tries';
    var puzzleId = location.href.match(/.*itstoohard.com\/puzzle\/(.*)/)[1];
    var tries = getTries();
    var lastSubmittedQuestion;

    GM_addStyle('.one-try { margin-left: 1px; line-height: 10px; display: list-item; list-style-position: inside; list-style-type: circle; }');
    GM_addStyle('.already-tried-value { color: red; }');
    registerClickEventOnSubmit();
    printAlreadyTriedAnswersForAllQuestions();

    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this.addEventListener("readystatechange", function(event) {
                if (this.readyState == 4) {
                    registerClickEventOnSubmit();
                    if (event.srcElement.responseText.indexOf('You must wait another') > -1) { //don't remember this try because we need to wait for submit
                        tries[lastSubmittedQuestion].pop();
                    }
                    printAlreadyTriedAnswers(lastSubmittedQuestion);
                    storeTries();
                }
            }, false);
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);

    function registerClickEventOnSubmit() {
        $('input[type="submit"').unbind('click.bladito_hook').bind('click.bladito_hook', function(event) {
            var $this = $(this);
            var questionNumber = parseInt($this.parent()[0].id.replace(/[^0-9]/g, ''), 10);
            var $triesForQuestion = $('.tries[question="' + questionNumber + '"]');
            var triedValue = $this.prev().val();

            lastSubmittedQuestion = questionNumber;

            tries[questionNumber] = tries[questionNumber] || [];
            if (tries[questionNumber].indexOf(triedValue) < 0) {
                tries[questionNumber].push(triedValue);
            } else {
                var $alreadyTriedEl = $this.next('.already-tried');
                if ($alreadyTriedEl.length) {
                    $alreadyTriedEl.children('.already-tried-value').text(triedValue);
                } else {
                    $this.after('<p class="already-tried">You\'ve already tried <span class="already-tried-value">' + triedValue + '</span> before! Try something new right away! No time penalty =).</p>');
                }
                event.preventDefault();
            }
        });
    }

    function printAlreadyTriedAnswers(questionNumber) {
        var wrap = '<div class="tries-wrap"><span>You\'ve already tried '+tries[questionNumber].length+' answers:</span>';
        tries[questionNumber].forEach(function(oneTry) {
            wrap += '<div class="one-try">' + oneTry + '</div>';
        });
        wrap += '</div>';

        $('#M_Repeater_Questions_Panel_Question_' + questionNumber).find('#M_Repeater_Questions_Label_Result_'+(questionNumber)).append(wrap);
    }

    function printAlreadyTriedAnswersForAllQuestions() {
        for (var questionNumber in tries) {
            printAlreadyTriedAnswers(questionNumber);
        }
    }

    function storeTries() {
        var triesForAllPuzzles = JSON.parse(localStorage.getItem(storageName)) || {};
        triesForAllPuzzles[puzzleId] = tries;
        localStorage.setItem(storageName, JSON.stringify(triesForAllPuzzles));
    }

    function getTries() {
        var triesForAllPuzzles = JSON.parse(localStorage.getItem(storageName)) || {};
        return triesForAllPuzzles[puzzleId] || {};
    }

})(jQuery);
