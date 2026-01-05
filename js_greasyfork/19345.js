// ==UserScript==
// @name       HeroQuizz highlight correct answer
// @namespace  http://mathemaniac.org/
// @version    1.0.0
// @description  Highlights the correct answers on HeroQuizz.
// @match        http://*.heroquizz.com/r/*
// @copyright  2016, Sebastian Paaske Tørholm
// @require    https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/19345/HeroQuizz%20highlight%20correct%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/19345/HeroQuizz%20highlight%20correct%20answer.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

/* Example HTML:
<div class="my_answers" id="r4_1" onclick="AnswerQuestion(4, 1, 28, 2)">Ja, vi er helt alene</div>
<div class="my_answers" id="r4_2" onclick="AnswerQuestion(4, 2, 28, 2)">Nej, naturligvis findes der live på andre planeter</div>

#1 is question number, #2 is answer number within question, #3 is actual question number, #4 is right answer number
*/

$('.my_answers').each( function () {
    var args = $(this).attr('onclick').match(/\d+/g);
    if (args[1] === args[3]) {
        $(this).css( { "background-color": '#A1E39F' } );
    }
} );
