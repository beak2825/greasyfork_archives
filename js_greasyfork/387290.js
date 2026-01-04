// ==UserScript==
// @name         CCTL Nouveau test
// @namespace    Exia Tools
// @version      1.0
// @description  Permet de repasser le test lors de la review.
// @author       Aurélien KLEIN
// @match        https://moodle-examens.cesi.fr/mod/quiz/review.php?attempt=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387290/CCTL%20Nouveau%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/387290/CCTL%20Nouveau%20test.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Buttons added
    const newTestBtn = document.createElement('button');
    newTestBtn.innerHTML = "Relancer le test";
    document.getElementById('mod_quiz_navblock').appendChild(newTestBtn);

    const showAnswersBtn = document.createElement('button');
    showAnswersBtn.innerHTML = "Afficher les réponses";
    showAnswersBtn.style.display = "none";
    document.getElementById('mod_quiz_navblock').appendChild(showAnswersBtn);

    const checkAnswersBtn = document.createElement('button');
    checkAnswersBtn.innerHTML = "Corriger";
    checkAnswersBtn.style.display = "none";
    document.getElementById('mod_quiz_navblock').appendChild(checkAnswersBtn);

    // Originals elements to edit
    let answers = document.querySelectorAll('.outcome');
    let corrections = document.querySelectorAll('.answer [class*=r]');
    const imgCorrect = document.querySelector('img.icon[title=Correct]').cloneNode(true);
    const imgIncorrect = document.querySelector('img.icon[title=Incorrect]').cloneNode(true);


    // Functions of buttons added
    newTestBtn.onclick = function() {
        newTestBtn.style.display = "none";
        showAnswersBtn.style.display = "block";
        checkAnswersBtn.style.display = "block";
        answers.forEach(answer => {answer.style.display = "none"});

        document.querySelectorAll('[disabled]').forEach(input => {input.removeAttribute("disabled")});
        document.querySelectorAll('input[readonly]').forEach(input => {input.removeAttribute("readonly"); input.value = ""});
        document.querySelectorAll('input[checked]').forEach(input => {input.removeAttribute("checked"); input.checked = false});
        document.querySelectorAll('select').forEach(input => {input.selectedIndex = 0});

        corrections.forEach(correction => {correction.classList.remove('correct');correction.classList.remove('incorrect');})
        let imgCorrections = document.querySelectorAll('img.icon');
        imgCorrections.forEach(imgCorrection => imgCorrection.remove());
    }





    showAnswersBtn.onclick = function() {
        if (answers[0].style.display == "none") {
            answers.forEach(answer => {answer.style.display = "block"});
            showAnswersBtn.innerHTML = "Masquer les réponses";
        } else {
            answers.forEach(answer => {answer.style.display = "none"});
            showAnswersBtn.innerHTML = "Afficher les réponses";
        }
    }

    checkAnswersBtn.onclick = function() {
        answers.forEach(answer => {answer.style.display = "block"});
        newTestBtn.style.display = "block";
        showAnswersBtn.style.display = "none";
        checkAnswersBtn.style.display = "none";
        document.querySelectorAll('.content').forEach(question => {
            question.querySelector('.answer').querySelectorAll('input').forEach(checked => {
                if (checked.checked) {
                    var text = checked.nextSibling.cloneNode(true);
                    [...text.children].forEach(child=>child.remove());
                    if (question.querySelector('.rightanswer').innerHTML.search(text.innerText) != -1) {
                        checked.parentElement.classList.add('correct');
                        checked.parentElement.appendChild(imgCorrect.cloneNode(true));
                    } else {
                        checked.parentElement.classList.add('incorrect');
                        checked.parentElement.appendChild(imgIncorrect.cloneNode(true));
                    }
                }
            })
        });
    }
})();