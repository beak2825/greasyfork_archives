// ==UserScript==
// @name         See CodeChum hidden test cases
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  See hidden test cases as if they are not hidden in codechum after you press submit
// @author       Lebron Samson
// @match        https://citu.codechum.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codechum.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/452144/See%20CodeChum%20hidden%20test%20cases.user.js
// @updateURL https://update.greasyfork.org/scripts/452144/See%20CodeChum%20hidden%20test%20cases.meta.js
// ==/UserScript==

// url regex
const testCaseEndpoint = new RegExp('answers-v4\/[0-9]+\/executev2', 'g');
const changeProblemEndPoints = [
    "v3/page-visits/",
    "v3/answers-v4/",
    "v3/answer-comments/count/"
];0

// Stylings
const style_testCaseContent = `display: grid; grid-row-gap: 16px; grid-template-column: minmax(0, 1fr); margin: 16px 0 8px;`;
const style_testCaseContent_title = `margin: 8px 0 12px;`;
const style_Text_n = `color: #b0b9bf;`;
const style_Text_heading = `font-family: Monsterrat,sans-serif; font-size: 1rem; line-height: 1.25; font-weight: 700; font-style: normal;`
const style_pre = `color: rgb(204, 204, 204); border-radius: 8px; background: rgb(45, 45, 45); font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; tab-size: 4; hyphens: none; padding: 1em; margin: 0.5em 0px; overflow: auto;`;
const style_Code_sm = `background-color: #2d3845 !important;`
const style_code_el = `color: rgb(204, 204, 204); font-size: 14px; background: none; font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; tab-size: 4; hyphens: none;`;

// NEW STYLINGS
const n_style_pre = `font-size: .875rem !important; font-style: normal; border-radius: 8px; margin: 0 !important; background-color: #2d3845 !important`;
const n_style_code_h6 = `margin: 8px 0 12px !important`;
const n_style_Text_heading = `
    color: #b0b9bf;
	font-family: Montserrat,sans-serif;
	font-size: 1rem;
	line-height: 1.25;
	font-weight: 700;
	font-style: normal;
	margin: 0;
`;

// Test Case template
const testCaseDiv = document.createElement("div");
testCaseDiv.classList.add("toBeHiddenIfClicked");
testCaseDiv.innerHTML = `
<div style="${style_testCaseContent} overflow-x: scroll;">
    <div>
        <h6 style="${style_testCaseContent_title}${style_Text_n}${style_Text_heading}">
            Expected Output
        </h6>
        <div>
            <pre style='${style_pre}${style_Code_sm}'><code style='${style_code_el}'>
                    put test cases in here
                </code></pre>
        </div>
    </div>
</div>
`;

function getCodeDisplay(title, code){
    const str =
      `
        <h6 style='${n_style_code_h6}${n_style_Text_heading}'>${title}</h6>
        <div data-test="codeDiv">
            <pre
            style='color: rgb(204, 204, 204); background: rgb(45, 45, 45); font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; tab-size: 4; hyphens: none; padding: 1em; margin: 0.5em 0px; overflow: auto; ${n_style_pre}'
            ><code style='color: rgb(204, 204, 204); background: none; font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace; text-align: left; white-space: pre; word-spacing: normal; word-break: normal; overflow-wrap: normal; line-height: 1.5; tab-size: 4; hyphens: none;'>${code}</code></pre>
        </div>
    `;

    const anotherSTR = `
    <div style="${style_testCaseContent} overflow-x: auto;">
        <div>
            <h6 style="${style_testCaseContent_title}${style_Text_n}${style_Text_heading}">
                ${title}
            </h6>
            <div>
                <pre style='${style_pre}${style_Code_sm}'><code style='${style_code_el}'>${code}</code></pre>
            </div>
        </div>
    </div>
    `;

    const div = document.createElement("div");
    div.classList.add("toBeHiddenIfClicked");
    div.innerHTML = anotherSTR;
    return div;
}

function getDOM(targetCL, tag = "div"){
    // fuck off obfuscation
    return Array.from(document.querySelectorAll(tag)).filter(e => e.classList.length > 0).filter(e => Array.from(e.classList).some(cl => cl.includes(targetCL)));
}

function getProblemName(){
    return getDOM("Text", "h4")[0].innerText;
}

function event_displayHiddenCaseOnClick(e){
    // if next sibling (test case container) is hidden, then show, else hide
    const tobeHidden = this.parentElement.getElementsByClassName("toBeHiddenIfClicked");
    Array.from(tobeHidden).forEach(el => {
        el.style.display = (el.style.display != "block") ? "block" : "none";
    })
}

function event_displayCasesOnClick(e){
    setTimeout(() => {
        tryToLoadCases("NOTHING");
    }, 100);
}

function tryToLoadCases(arg){
    const currProb = getProblemName();

    console.log(currProb);

    // try to find the test case saved in the problem
    let saved = sessionStorage.getItem("saved_test_cases");
    if(!saved) return;

    saved = JSON.parse(saved);

    const matches = saved.filter(e => e.problem == currProb);

        console.log(matches);

    if(matches.length){
        displayCase(matches[0].cases, matches[0].actuals);
    }
}

function displayCase(cases, actuals = []){

    let testCaseCont = getDOM("testCases")[0];

    console.log("Testcases:", testCaseCont);

    if(testCaseCont.length && testCaseCont.length == 0 || cases.length == 0) return;

    try{
        testCaseCont = testCaseCont.children[1];
    }catch{
        return;
    }
    // if there is a constraint, then the test case content is the second child
    // testCaseCont = ((testCaseCont.length && testCaseCont.length > 1) ? testCaseCont[1] : testCaseCont[0]).children[1];

    Array.from(testCaseCont.children).forEach( (div, i) => {
        div = div.children[0];
        console.log(div);
        if(!div.children[0].disabled) return; // only modify hidden test cases

        const expected = getCodeDisplay("ExpectedOutput", cases[i].trim());
        const actual = getCodeDisplay("Your Output", actuals[i]?.trim());

        expected.style.display = "none";
        actual.style.display = "none";

        // if div is not yet marked, add an event listener to the button
        if(div.dataset.marked != "true"){
            div.children[0].disabled = false;
            div.children[0].addEventListener("click", event_displayHiddenCaseOnClick);
            div.children[0].style.cursor = "pointer";
        }

        // set the div as marked
        div.dataset.marked = "true";

        div.append(actual, expected);
        // div.children[1].style.display = "none";

        console.log("TEST");
    });
}

function saveCase(arg){
    const prob = getProblemName();

    let saved = sessionStorage.getItem("saved_test_cases") || [
        {
            problem: prob,
            cases: arg.cases
        }
    ];

    if(typeof saved == "string"){
        saved = JSON.parse(saved);

        // check if problem is already saved, if not then save
        if(!saved.some(e => e.problem == prob)) {
            saved.push({
                problem: prob,
                cases: arg.cases,
                actuals: arg.actuals
            });
        }
    }

    sessionStorage.setItem("saved_test_cases", JSON.stringify(saved));
}

var shouldLoadCases = false, flag_changeProblem = [0, 0, 0];

function receiveCases(arg){
    let res;

    console.log("YOU SUBMITTED");

    try {
        res = JSON.parse(arg.response);
    }catch (err){
        return;
    }

    if(!res.test_case_statuses) return;

    const testCase = {
        id: res.id,
        answer_id: res.answer_id,
        actuals: res.test_case_statuses.map(e => e.actual_output),
        cases: res.test_case_statuses.map(e => e.test_case.output)
    }

    if(!this.firstRun){
        this.firstRun = 1;
        // the first ever submit, add event listener to test cases button and change problem button

        const test_case_button = document.querySelector("#testsTab");
        const change_problem_button = getDOM("navigation_nav", "div")[0].querySelectorAll(`button`);

        console.log(change_problem_button);

        test_case_button.addEventListener("click", event_displayCasesOnClick);
        change_problem_button.forEach(e => e.addEventListener("click", function(){
            shouldLoadCases = true;
        }));
    }

    displayCase(testCase.cases, testCase.actuals);
    saveCase(testCase);
}

(function() {
    'use strict';

    // Modify open and send requests

    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

    function openReplacement(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if(this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }

        // if you want to modify send requests

        this.onreadystatechange = onReadyStateChangeReplacement;
        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {

        // modify here received requests

        // for submitting
        if(testCaseEndpoint.test(this._url)) receiveCases(this);

        // for changing problems
        else if(changeProblemEndPoints.some(e => this._url.includes(e)) && shouldLoadCases){
            flag_changeProblem[changeProblemEndPoints.findIndex(e => this._url.includes(e))]++;

            if(flag_changeProblem.every(e => e == 3)){
                console.log("YOU CHANGED TABS!!!!!!!!!!!");
                tryToLoadCases(this);
                shouldLoadCases = false;
                flag_changeProblem = [0, 0, 0];
            }
        }

        if(this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;

    var request = new XMLHttpRequest();
    request.open('GET', '.', true);
    request.send();

})();