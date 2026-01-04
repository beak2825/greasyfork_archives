// ==UserScript==
// @name         CCTL Relecture
// @namespace    Exia Tools
// @version      2.0
// @description  Affiche les couleurs lors de la relecture du CCTL et affiche la note prévisionnel.
// @author       LynEvans, repris et modifié par Aurélien KLEIN
// @match        https://moodle-examens.cesi.fr/mod/quiz/review.php?attempt=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386402/CCTL%20Relecture.user.js
// @updateURL https://update.greasyfork.org/scripts/386402/CCTL%20Relecture.meta.js
// ==/UserScript==


window.CCTL = {

    questions : {},
    score : 0,
    scoreMax : 0,
    loadQuestions : function(){
        if(this.questions != {}){
            this.questions = {};
        }

        var questionBlocks = document.getElementsByClassName('que');
        for(var id in questionBlocks){
            if(!isNaN(id)){
                var numero = parseInt(questionBlocks[id].querySelector('.qno').innerHTML);
                var qScore = parseFloat(questionBlocks[id].querySelector('.grade').innerHTML.substring(9));
                this.questions[parseInt(id)+1] = this.createQuestion(numero, qScore, questionBlocks[id]);
                this.score += this.questions[parseInt(id)+1].score;
            }
        }
    },

    createQuestion : function(nQuest, scoreQuest, blockQuest, typeQuest){

        CCTL.scoreMax += scoreQuest;
        var feedback = blockQuest.querySelector('.feedback').textContent;
        var result = 0;
        var questionResult = "INCORRECT";

        var typeQuestion = blockQuest.querySelector('.content');

        if(typeQuestion.querySelectorAll("input[type='radio'][name*='answer']").length > 0){
            typeQuestion = this.typeQuestions[2];
        } else if(typeQuestion.querySelectorAll("input[type='checkbox'][name*='choice']").length > 0){
            typeQuestion = this.typeQuestions[0];
        } else if(typeQuestion.querySelectorAll("select").length > 0){
            typeQuestion = this.typeQuestions[1];
        } else if(typeQuestion.querySelectorAll("input[type='text'][name*='answer']").length > 0){
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
                    nAnswers = blockQuest.querySelector('.qtext').textContent;
                    nAnswers = parseInt(nAnswers.substring(nAnswers.lastIndexOf('(')+1, nAnswers.lastIndexOf('réponse')-1));
                    nAnswersGood = blockQuest.querySelector('.numpartscorrect').textContent;
                    nAnswersGood = parseInt(nAnswersGood.substring(nAnswersGood.lastIndexOf('Vous en avez sélectionné correctement')+38, nAnswersGood.lastIndexOf('.')));
                    result = Math.round(((nAnswersGood / nAnswers) * scoreQuest) * 10 ) / 10;
                    break;
                case "FILL BLANK":
                    nAnswers = blockQuest.querySelectorAll('select').length;
                    nAnswersGood = blockQuest.querySelector('.numpartscorrect').textContent;
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


document.body.onload = function(){

    CCTL.loadQuestions();

    for(var id in CCTL.questions){
        document.getElementById("q" + id).querySelector('.outcome').style.color = 'black';
        document.getElementById("q" + id).querySelector('.outcome').style.textShadow = '0 0 0 transparent';
        document.getElementById("quiznavbutton" + id).querySelector('.thispageholder').style.backgroundColor = 'cover';
        switch (CCTL.questions[id].result){
            case "CORRECT":
                document.getElementById("q" + id).querySelector('.outcome').style.backgroundColor = '#29ad57';
                document.getElementById("quiznavbutton" + id).querySelector('.trafficlight').style.backgroundColor = '#29ad57';
                break;
            case "PARTIEL":
                document.getElementById("q" + id).querySelector('.outcome').style.backgroundColor = 'rgb(240, 176, 48)';
                document.getElementById("quiznavbutton" + id).querySelector('.trafficlight').style.backgroundColor = 'rgb(240, 176, 48)';
                break;
            case "INCORRECT":
                document.getElementById("q" + id).querySelector('.outcome').style.backgroundColor = 'rgb(192, 48, 48)';
                document.getElementById("quiznavbutton" + id).querySelector('.trafficlight').style.backgroundColor = 'rgb(192, 48, 48)';
                break;
        }
    }

    var ratio = parseFloat(CCTL.score) / parseFloat(CCTL.scoreMax);
    var note = ratio >= 0.75 ? "A" : ratio >= 0.5 ? "B" : ratio >= 0.25 ? "C" : "D";

    document.getElementById("mod_quiz_navblock").innerHTML += "<h4 style='text-align:center;font-weight:bold;'>" + CCTL.score + "/" + CCTL.scoreMax + " => " + note + "</h4>";

}