// ==UserScript==
// @name         New US v4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Contras mode for Canvas
// @author       You
// @match        https://canvas.elte.hu/courses/*/quizzes/*/take
// @match        https://canvas.elte.hu/*
// @match        https://canvas.instructure.com/courses/7078160/quizzes/14624278/take?preview=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468517/New%20US%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/468517/New%20US%20v4.meta.js
// ==/UserScript==



async function sendTestQuestion(question, possibleAnswers, questionType) {
    const response = await fetch('https://highroller.ddns.net/receive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: question,
            possible_answers: possibleAnswers,
            question_type: questionType
        }),
    });
    const data = await response.json();
    return data;
}

async function processQuestions(){
    var kerdesek = document.querySelectorAll("div.display_question");
    for (let i = 0; i < kerdesek.length; i++) {
        var valaszok = kerdesek[i].querySelectorAll('.answer_label');
        valaszok  = Array.from(valaszok);

        for(let i = 0; i < valaszok.length; i++) {
            let answer = valaszok[i];

            // Check if the answer contains a LaTeX image.
            let equationImage = answer.querySelector('img.equation_image');
            let valaszBruttoSzovege = "";

            if(equationImage) {
                // If there is an equation image, grab the LaTeX content.
                let latexContent = equationImage.getAttribute('data-equation-content');
                console.log("raw Latex: " + latexContent);
                valaszBruttoSzovege = answer.textContent;
                valaszBruttoSzovege = valaszBruttoSzovege.trim();
                valaszBruttoSzovege += ' ' + latexContent;

                // Add the LaTeX content to the textContent of the answer, separating them with a space.
                //answer.textContent = answer.textContent.trim() + ' ' + latexContent;
            } else {
                // If there is no equation image, leave the textContent as is.
                valaszBruttoSzovege = answer.textContent;
                valaszBruttoSzovege = valaszBruttoSzovege.trim();
                //answer.textContent = answer.textContent.trim();
            }

            valaszok[i] = valaszBruttoSzovege;
        }

        var kerdes_szovege = kerdesek[i].querySelector('.question_text').textContent.trim();

        var kerdesTipus = "multiple_answer";
        if (kerdesek[i].classList.contains('multiple_choice_question'))
        {
            kerdesTipus = "one_answer";
        }
        else{
            kerdesTipus = "multiple_answer";
        }
        try {
            const data = await sendTestQuestion(kerdes_szovege, valaszok, kerdesTipus);
            console.log('Success:', data);
            const correctAnswers = data.correct_answer;
            console.log(correctAnswers);
            var valaszok_friss = kerdesek[i].querySelectorAll('.answer_label');
            // make the correct answers bold
            correctAnswers.forEach(index => {
                //valaszok_friss[index].style.fontWeight = 'bold';
                valaszok_friss[index].style.textDecoration = 'underline';
                valaszok_friss[index].style.textDecorationColor = '#eee';
                valaszok_friss[index].previousElementSibling.style.filter = "brightness(96%)";
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
        processQuestions();
    }
});

