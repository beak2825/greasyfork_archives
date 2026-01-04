// ==UserScript==
// @name         CCTL Corrector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Corrige les CCTLs qui ne l'ont pas été
// @author       Loadren
// @match        https://moodle-examens.cesi.fr/mod/quiz/review.php?attempt=*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404530/CCTL%20Corrector.user.js
// @updateURL https://update.greasyfork.org/scripts/404530/CCTL%20Corrector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = jQuery;

    var CCTL = [];
    var CCTLPoints = 0;
    var CCTLPointsMax = 0;

    $(".que").each(function(){

        var question = {};

        //adding params
        question.id = "#" + this.id;
        question.number = $(this).find('.qno').text();
        question.rightAnswer = $(this).find('.rightanswer').text();
        question.correctAnswers = 0;
        question.wrongAnswers = 0;
        question.correctAnswersCount = 0;

        //adding answers
        question.answers = [];
        $(this).find('.answer > .r0, .answer > .r1').each(function(){
            question.answers.push({text : $(this).text().trim(), checked : $(this).find('input')[0].checked});
        });

        //processing answers
        question.answers.map(ans => {
            if(ans.checked){
                if(question.rightAnswer.indexOf(ans.text) > -1){
                    ans.backgroundColor = "palegreen";
                    question.correctAnswers++;
                    question.correctAnswersCount++;
                }else{
                    ans.backgroundColor = "lightpink";
                    question.wrongAnswers++;
                }
            }else{
                if(question.rightAnswer.indexOf(ans.text) > -1){
                    ans.backgroundColor = "palegoldenrod";
                    question.correctAnswersCount++;
                }else{
                    ans.backgroundColor = "";
                }
            }
        });

        //Guess question points
        if((question.wrongAnswers + question.correctAnswers) !== question.correctAnswersCount){
            question.points = 0;
        }else{
            question.points = Math.round((question.correctAnswers / question.correctAnswersCount)*100)/100;
        }

        if($(this).find('.answer input[type=checkbox]').length > 0){
            question.type = "multichoice";
        }else if($(this).find('.answer input[type=radio]').length > 0){
            question.type = "choice";
        }

        CCTL.push(question);

    });

    for(var question in CCTL){
        CCTL[question].answers.map((ans, index) => {
            //Answer background color
            $(CCTL[question].id).find('.answer > .r0, .answer > .r1')[index].style.backgroundColor = ans.backgroundColor;
        });

        //Question background color
        switch (CCTL[question].points){
            case 0:
                $(".qnbutton")[question].style.backgroundColor = "lightpink";
                break;
            case 1:
                $(".qnbutton")[question].style.backgroundColor = "palegreen";
                break;
            default:
                $(".qnbutton")[question].style.backgroundColor = "palegoldenrod";
                break;
        }

        CCTLPoints += CCTL[question].points;
        CCTLPointsMax++;
    }

    $(".card-text").append($("<h3>" + CCTLPoints + "/" + CCTLPointsMax + "</h3>"));

})();