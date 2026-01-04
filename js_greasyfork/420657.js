// ==UserScript==
// @name         NTU LAMS quiz automatic guess and check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save up to 5 minutes of your life by having JavaScript automatically spam MCQ answers on your behalf
// @author       NUS School of Computing
// @match        https://lams.ntu.edu.sg/lams/tool/lamc11/learning/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420657/NTU%20LAMS%20quiz%20automatic%20guess%20and%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/420657/NTU%20LAMS%20quiz%20automatic%20guess%20and%20check.meta.js
// ==/UserScript==

// first load
function first_guess(){
    sessionStorage['answers'] = '';
    var questions = document.getElementsByClassName('row no-gutter');
    for (var i = 2; i < questions.length; i++) {
        var first_ans = questions[i].querySelector('input');
        first_ans.checked = true;
    }
    click_right_button();
}

// go back to attempt again
function enter_new_guesses(){
    var correct_answers = JSON.parse(sessionStorage['answers']); // retrieve answers
    var questions = document.getElementsByClassName('row no-gutter');
    var NON_ANSWER_PANELS = 2;
    for (var i = NON_ANSWER_PANELS; i < questions.length; i++) { // first two elements are not questions
        var radio_buttons = questions[i].getElementsByTagName('input');
        var button_to_check = correct_answers[i-NON_ANSWER_PANELS]; // check the same option if correct, try the next option if wrong
        radio_buttons[button_to_check].checked = true;
    }
    click_right_button();
}

// after getting second answers
function iterate_guesses(){
    var NON_ANSWER_PANELS = 1;
    var completion_flag = true;
    var panels = document.getElementsByClassName('panel');
    //var correct_answers = JSON.parse(sessionStorage['answers']) || new Array(len).fill(0);
    try {
        var correct_answers = JSON.parse(sessionStorage['answers']);
    } catch(e) {
        var len = panels.length - NON_ANSWER_PANELS;
        correct_answers = new Array(len).fill(0);
    }
    for (var i = NON_ANSWER_PANELS; i < panels.length; i++) {
        var result = panels[i].getElementsByTagName('td');
        var answer = result[result.length-2]; // second last element holds the sign identifying correct or wrong answer
        console.log(answer.className);
        if (answer.className != 'bg-success') {
            completion_flag = false;
            correct_answers[i-NON_ANSWER_PANELS] += 1; // change the next guess if not correct
        }
    }
    console.log(completion_flag);
    if(!completion_flag){
        sessionStorage['answers'] = JSON.stringify(correct_answers); // save in session so we dont lose on page reload
        console.log(sessionStorage['answers']);
        click_left_button();
    } else {
        alert('You got 100%! :D\nScroll down to review the answers!\nOr be like everyone else and click Next Activity :P');
    }
}

function click_left_button(){
    var btn = document.getElementsByClassName('btn btn-primary pull-left')[0];
    btn.click();
}

function click_right_button(){
    var btn = document.getElementsByClassName('btn btn-sm btn-primary pull-right')[0];
    btn.click();
}

(function() {
    'use strict';
    console.log('guesser active');
    var panels = document.getElementsByClassName('panel');
    var firstpage = (panels[1].className != "panel panel-default");

    var btn1 = document.createElement('button');
    btn1.innerHTML = 'First Guess';
    btn1.addEventListener('click', first_guess);

    var btn3 = document.createElement('button');
    btn3.innerHTML = 'Enter New Guesses';
    btn3.addEventListener('click', enter_new_guesses);

    var btn4 = document.createElement('div');
    btn4.classList.add('btn');
    btn4.style.border = '1px solid black';
    btn4.innerHTML = 'Iterate Guesses';
    btn4.addEventListener('click', iterate_guesses);

    var panel_body = document.getElementsByClassName('panel-body panel-learner-body')[0];
    if(firstpage){
        panel_body.parentNode.insertBefore(btn1, panel_body);
        panel_body.parentNode.insertBefore(btn3, panel_body);
    } else {
        panel_body.parentNode.insertBefore(btn4, panel_body);
    }
})();