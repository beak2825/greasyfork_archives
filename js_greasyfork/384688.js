// ==UserScript==
// @name         CCTL Formatter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://moodle-examens.cesi.fr/mod/quiz/review.php?attempt=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384688/CCTL%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/384688/CCTL%20Formatter.meta.js
// ==/UserScript==

window.CCTL = {

    questions : {},
    score : 0,
    loadQuestions : function(){
        if(this.questions != {}){
            this.questions = {};
        }

        var questionBlocks = document.getElementsByClassName('que');
        for(var id in questionBlocks){
            if(!isNaN(id)){
                var numero = parseInt($(questionBlocks[id]).find('.qno')[0].innerHTML);
                var qScore = parseFloat($(questionBlocks[id]).find('.grade')[0].innerHTML.substring(9));
                this.questions[parseInt(id)+1] = this.createQuestion(numero, qScore, questionBlocks[id]);
                this.score += this.questions[parseInt(id)+1].score;
            }
        }
    },

    createQuestion : function(nQuest, scoreQuest, blockQuest, typeQuest){

        var feedback = $(blockQuest).find('.feedback')[0].textContent;
        var result = 0;
        var questionResult = "INCORRECT";

        var typeQuestion = $(blockQuest).find('.content')[0];

        if($(typeQuestion).find("input[type='radio'][name*='answer']").length > 0){
            typeQuestion = this.typeQuestions[2];
        } else if($(typeQuestion).find("input[type='checkbox'][name*='choice']").length > 0){
            typeQuestion = this.typeQuestions[0];
        } else if($(typeQuestion).find("select").length > 0){
            typeQuestion = this.typeQuestions[1];
        } else if($(typeQuestion).find("input[type='text'][name*='answer']").length > 0){
            typeQuestion = this.typeQuestions[3];
        }

        if(feedback.indexOf('Votre réponse est correcte.') > -1){
            result = scoreQuest;
            questionResult = "CORRECT"
        }else if(feedback.indexOf('Votre réponse est partiellement correcte') > -1){
            var nAnswers = 0;
            var nAnswersGood = 0;
            questionResult = "PARTIEL";
            switch (typeQuestion) {
                case "CHOOSE ONE":
                    // Impossible
                    break;
                case "CHOOSE MANY":
                    nAnswers = $(blockQuest).find('.qtext')[0].textContent;
                    nAnswers = parseInt(nAnswers.substring(nAnswers.lastIndexOf('(')+1, nAnswers.lastIndexOf('réponse')-1));
                    nAnswersGood = $(blockQuest).find('.numpartscorrect')[0].textContent;
                    nAnswersGood = parseInt(nAnswersGood.substring(nAnswersGood.lastIndexOf('Vous en avez sélectionné correctement')+38, nAnswersGood.lastIndexOf('.')));
                    result = Math.round(((nAnswersGood*scoreQuest) / nAnswers) * 10 ) / 10;
                    break;
                case "FILL BLANK":
                    nAnswers = $(blockQuest).find('select').length;
                    nAnswersGood = $(blockQuest).find('.numpartscorrect')[0].textContent;
                    nAnswersGood = parseInt(nAnswersGood.substring(nAnswersGood.lastIndexOf('Vous en avez sélectionné correctement')+38, nAnswersGood.lastIndexOf('.')));
                    result = Math.round(((nAnswersGood*scoreQuest) / nAnswers) * 10 ) / 10;
                    break;
                case "FILL INPUT":
                    //Impossible
                    break;
            }
        }

        return {number : nQuest, grade : scoreQuest, score : result, type : typeQuestion, result : questionResult}
    },
    typeQuestions : ["CHOOSE MANY", "FILL BLANK", "CHOOSE ONE", "FILL INPUT"]

}

$(document).ready(function(){

    CCTL.loadQuestions();

    for(var id in CCTL.questions){
        switch (CCTL.questions[id].result){
            case "CORRECT":
                $("#q" + id).find('.outcome').css('background-color','#7aff89');
                $("#quiznavbutton" + id).find('.trafficlight').css('background-color','#29ad57');
                break;
            case "PARTIEL":
                $("#q" + id).find('.outcome').css('background-color','#f6f990');
                $("#quiznavbutton" + id).find('.trafficlight').css('background-color','#e2e519');
                break;
            case "INCORRECT":
                $("#q" + id).find('.outcome').css('background-color','#fc6464');
                $("#quiznavbutton" + id).find('.trafficlight').css('background-color','#e51818');
                break;
        }
    }

    $("#mod_quiz_navblock").append($("<h4 style='text-align:center;font-weight:bold;'>" + CCTL.score + "/" + Object.keys(CCTL.questions).length + "</h4>"))

});