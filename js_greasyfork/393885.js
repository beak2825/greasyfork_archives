// ==UserScript==
// @name         NYCU Course Questionnaires
// @namespace    https://github.com/FractaIism/TamperMonkey-UserScripts
// @version      1.2.2
// @description  Autofill course questionnaires
// @author       Fractalism
// @match        http*://course.nycu.edu.tw/TeachPoll/question.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393885/NYCU%20Course%20Questionnaires.user.js
// @updateURL https://update.greasyfork.org/scripts/393885/NYCU%20Course%20Questionnaires.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var randomize = false; // generate random answers for each question

    // parameter set 1 (used when randomize == false)
    var part1_ans = 3; // default answer for part 1 of questionnaire, values: 1~5 from left to right
    var part2_ans = 2; // default answer for part 2 of questionnaire, values: 1~X from left to right (default to 1 if option not available)
    var default_ans = 2; // if there are more than two parts

    // parameter set 2 (used when randomize == true)
    const ans_prob = Object.freeze({
        1: 10,
        2: 30,
        3: 50,
        4: 5,
        5: 1,
    }); //relative probability of each answer appearing if randomize is set (will be normalized so the sum of probabilities is 1). If a choice is not present, it will be ignored and normalization will be carried out with only the remaining choices.


    // function to fill out questionnaire
    function main() {
        let parts = document.querySelectorAll('table.stripeMe');
        Array.from(parts).forEach((part, part_index) => {
            let rows = part.getElementsByTagName('tr');
            Array.from(rows).forEach((row, row_index) => {
                let buttons = row.querySelectorAll('input[type=radio]');
                if (buttons.length == 0) return;
                let ans = getAns(part_index, buttons.length);
                if (buttons[ans - 1]) { // if selected score exists
                    //console.log(row_index + " case 1: normal")
                    buttons[ans - 1].checked = true;
                } else if (ans > buttons.length - 1) {
                    //console.log(row_index + " case 2: overflow")
                    buttons[buttons.length - 1].checked = true;
                } else if (ans < 0) {
                    //console.log(row_index + " case 3: underflow")
                    buttons[0].checked = true;
                } else {
                    //console.log(row_index + " case 4: unexpected score, use default")
                    //console.log(buttons.length)
                    buttons[Math.floor(buttons.length / 2 - 1)].checked = true;
                }
            })
        });

        // check all checkboxes
        Array.from(document.querySelectorAll('input[type=checkbox]')).forEach((item) => item.checked = true);
    };

    main();
    // manually solve captcha
    window.scrollTo(0, document.body.scrollHeight);
    document.querySelector('input[name=qCode]').focus();

    (function makeMenu() {
        // a place for buttons (additional functionality)
        var menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.top = '15px';
        menu.style.right = '40px';
        document.body.appendChild(menu);

        // add score select
        var scoreSelect = document.createElement('select');
        scoreSelect.id = 'scoreSelect';
        scoreSelect.style.margin = '7px 7px 7px 7px';
        for (let i = 1; i <= 7; ++i) {
            let optionNode = document.createElement('option');
            scoreSelect.appendChild(optionNode);
        }
        scoreSelect.firstChild.textContent = '== 選擇評分 ==';
        let scoreText = ['', '非常滿意', '滿意', '普通', '不滿意', '非常不滿意']
        for (let i = 1; i <= 5; ++i) {
            scoreSelect.children[i].value = i;
            scoreSelect.children[i].textContent = scoreText[i];
        }
        scoreSelect.lastChild.value = '-1';
        scoreSelect.lastChild.textContent = '隨機';
        menu.appendChild(scoreSelect);

        // add refill button
        var refillBtn = document.createElement('button');
        refillBtn.style.margin = '7px 7px 7px 7px';
        refillBtn.innerText = '自動填答';
        refillBtn.addEventListener('click', main);
        menu.appendChild(refillBtn);

        // add reload button
        var reloadBtn = document.createElement('button');
        reloadBtn.style.margin = '7px 7px 7px 7px';
        reloadBtn.innerText = '重新整理';
        reloadBtn.addEventListener('click', location.reload.bind(window.location));
        menu.appendChild(reloadBtn);
    })();


    // opt_len: number of options
    function getAns(part_index, opt_len) {
        // use user-selected score if available
        var selScore = document.getElementById('scoreSelect')?.value;
        if (!isNaN(selScore)) {
            if (selScore == -1) { // random answers
                randomize = true;
                // fall through to get a random answer
            } else {
                return selScore;
            }
        }
        // on page load, use script config
        if (randomize) {
            let prob = Object.assign({}, ans_prob); // make a copy
            for (let i = opt_len + 1; i <= 5; ++i) {
                prob[i] = 0; // for nonexistent options, probability = 0
            }
            let cmf = normalize(prob);
            let rnd = Math.random(); // random float in [0,1)
            let choice;
            for (let i = 1; i <= 5; ++i) {
                if (rnd < cmf[i]) {
                    choice = i;
                    break;
                }
            }
            return choice;
        } else {
            if (part_index == 0) return part1_ans;
            else if (part_index == 1) return part2_ans;
            else return default_ans;
        }
    }

    // get non-normalized pmf and return normalized cmf
    // pmf: probability mass function
    // cmf: cumulative mass function
    function normalize(massfunc) {
        // calculate the sum of numbers in pmf to normalize it
        let pmf = Object.assign({}, massfunc); // javascript uses call by sharing for object arguments, so copy object using Object.assign
        let sum = 0;
        for (let i in pmf) {
            sum += pmf[i];
        }
        // normalize pmf and convert to cmf
        let cmf = {};
        for (let i = 1; i <= 5; ++i) {
            pmf[i] /= sum;
            cmf[i] = i == 1 ? pmf[i] : cmf[i - 1] + pmf[i];
        }
        return cmf;
    }

})();
