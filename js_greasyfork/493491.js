// ==UserScript==
// @name         JEEHub Scorecard Generator
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  Generates scorecard
// @author       Legendary
// @match        https://www.tampermonkey.net/scripts.php
// @icon         https://jeehub.vercel.app/favicon.ico
// @grant        none
// @match      https://bitsat-quiz.jee-adv.eu.org/*
// @match      https://jeehub.vercel.app/*
// @license    GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/493491/JEEHub%20Scorecard%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/493491/JEEHub%20Scorecard%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

function scorecardGenerator() {
  let style = `<style>
.bg-green-500{
        background-color:rgb(255 0 196);

    }
.border-green-500{
        border-color:rgb(255 0 196);
    }

    .bg-red-500{
        background-color:rgb(255 0 196);
    }
.border-red-500{
        border-color:rgb(255 0 196);
    }
.mt-4 {
display:none;
}
.tansition-all {
display:none;
}

</style>`;

  document.head.insertAdjacentHTML("beforeend", style);
  let button = document.getElementById("scorecard-generator");
  if (!button) button = document.createElement("button");
  button.id = "scorecard-generator";
  button.innerHTML = "Click Here To Submit";
  button.onclick = () => {
    let incorrectqns = document.getElementsByClassName("border-red-500");
    let correctqns = document.getElementsByClassName("border-green-500");
    let allQns = document.getElementsByClassName("text-zinc-300");
    let correct = correctqns.length;
    let incorrect = incorrectqns.length;
    let totalQns = allQns.length;
    let style = `<style>
.bg-green-500{
       background-color: rgb(34 197 94/var(--tw-bg-opacity))

    }
.border-green-500{
       border-color: rgb(34 197 94/var(--tw-bg-opacity))
    }

    .bg-red-500{
        background-color:rgb(239 68 68/var(--tw-bg-opacity))
    }
.border-red-500{
        border-color:rgb(239 68 68/var(--tw-bg-opacity))
    }
.mt-4 {
display:block;
}
.tansition-all {
display:block;
}

</style>`;

    document.head.insertAdjacentHTML("beforeend", style);
    let incPhys = 0,
      cPhys = 0,
      incChem = 0,
      cChem = 0,
      incMath = 0,
      cMath = 0,
      incLR = 0,
      cLR = 0,
      incEng = 0,
      cEng = 0;
    let output = `Submitted Successfully
Total Score: ${correct * 3 - incorrect} / ${totalQns * 3}



Total Attempted: ${incorrect + correct}
Total Correct: ${correct}
Total Incorrect: ${incorrect}
Total Unattempted: ${totalQns - correct - incorrect}
Marks Gained: ${correct * 3}
Marks Lost: ${incorrect}
Accuracy: ${(correct / (incorrect + correct)) * 100}%

Subject Wise Performance:

`;

    if (totalQns == 130) {
      for (let qn of correctqns) {
        let qnN = parseInt(qn.innerHTML.replace(/\D/g, ""));
        if (qnN < 31) cPhys++;
        else if (qnN < 61) cChem++;
        else if (qnN < 71) cEng++;
        else if (qnN < 91) cLR++;
        else cMath++;
      }
      for (let qn of incorrectqns) {
        let qnN = parseInt(qn.innerHTML.replace(/\D/g, ""));
        if (qnN < 31) incPhys++;
        else if (qnN < 61) incChem++;
        else if (qnN < 71) incEng++;
        else if (qnN < 91) incLR++;
        else incMath++;
      }

      output += `Physics: ${cPhys * 3 - incPhys} / 90                | Chemistry: ${cChem * 3 - incChem} / 90              | English: ${cEng * 3 - incEng} / 30
Total Attempted: ${incPhys + cPhys} / 30          | Total Attempted: ${incChem + cChem} / 30          | Total Attempted: ${incEng + cEng} / 10
Total Correct: ${cPhys}                         | Total Correct: ${cChem}                         | Total Correct: ${cEng}
Total Incorrect: ${incPhys}                     | Total Incorrect: ${incChem}                     | Total Incorrect: ${incEng}
Total Unattempted: ${30 - incPhys - cPhys}          | Total Unattempted: ${30 - incChem - cChem}          | Total Unattempted: ${10 - incEng - cEng}
Marks Gained: ${cPhys * 3}                        | Marks Gained: ${cChem * 3}                        | Marks Gained: ${cEng * 3}
Marks Lost: ${cPhys}                            | Marks Lost: ${incChem}                          | Marks Lost: ${incEng}
Accuracy: ${(cPhys / (incPhys + cPhys)) * 100}%       | Accuracy: ${(cChem / (incChem + cChem)) * 100}%       | Accuracy: ${(cEng / (incEng + cEng)) * 100}%

Logical Reasoning: ${cLR * 3 - incLR} / 60          | Mathematics: ${cMath * 3 - incMath} / 120
Total Attempted: ${incLR + cLR} / 20              | Total Attempted: ${incMath + cMath} / 40
Total Correct: ${cLR}                           | Total Correct: ${cMath}
Total Incorrect: ${incLR}                       | Total Incorrect: ${incMath}
Total Unattempted: ${20 - incLR - cLR}              | Total Unattempted: ${40 - incMath - cMath}
Marks Gained: ${cLR * 3}                          | Marks Gained: ${cMath * 3}
Marks Lost: ${incLR}                            | Marks Lost: ${incMath}
Accuracy: ${(cLR / (incLR + cLR)) * 100}%             | Accuracy: ${(cMath / (incMath + cMath)) * 100}%
`;
    } else if (totalQns == 150) {
      for (let qn of correctqns) {
        let qnN = parseInt(qn.innerHTML.replace(/\D/g, ""));
        if (qnN < 41) cPhys++;
        else if (qnN < 81) cChem++;
        else if (qnN < 96) cEng++;
        else if (qnN < 106) cLR++;
        else cMath++;
      }
      for (let qn of incorrectqns) {
        let qnN = parseInt(qn.innerHTML.replace(/\D/g, ""));
        if (qnN < 41) incPhys++;
        else if (qnN < 81) incChem++;
        else if (qnN < 96) incEng++;
        else if (qnN < 106) incLR++;
        else incMath++;
      }

      output += `Physics: ${cPhys * 3 - incPhys} / 120                | Chemistry: ${cChem * 3 - incChem} / 120              | English: ${cEng * 3 - incEng} / 45
Total Attempted: ${incPhys + cPhys} / 40          | Total Attempted: ${incChem + cChem} / 40          | Total Attempted: ${incEng + cEng} / 15
Total Correct: ${cPhys}                         | Total Correct: ${cChem}                         | Total Correct: ${cEng}
Total Incorrect: ${incPhys}                     | Total Incorrect: ${incChem}                     | Total Incorrect: ${incEng}
Total Unattempted: ${40 - incPhys - cPhys}          | Total Unattempted: ${40 - incChem - cChem}          | Total Unattempted: ${15 - incEng - cEng}
Marks Gained: ${cPhys * 3}                        | Marks Gained: ${cChem * 3}                        | Marks Gained: ${cEng * 3}
Marks Lost: ${cPhys}                            | Marks Lost: ${incChem}                          | Marks Lost: ${incEng}
Accuracy: ${(cPhys / (incPhys + cPhys)) * 100}%       | Accuracy: ${(cChem / (incChem + cChem)) * 100}%       | Accuracy: ${(cEng / (incEng + cEng)) * 100}%

Logical Reasoning: ${cLR * 3 - incLR} / 30          | Mathematics: ${cMath * 3 - incMath} / 135
Total Attempted: ${incLR + cLR} / 10              | Total Attempted: ${incMath + cMath} / 45
Total Correct: ${cLR}                           | Total Correct: ${cMath}
Total Incorrect: ${incLR}                       | Total Incorrect: ${incMath}
Total Unattempted: ${10 - incLR - cLR}              | Total Unattempted: ${45 - incMath - cMath}
Marks Gained: ${cLR * 3}                          | Marks Gained: ${cMath * 3}
Marks Lost: ${incLR}                            | Marks Lost: ${incMath}
Accuracy: ${(cLR / (incLR + cLR)) * 100}%             | Accuracy: ${(cMath / (incMath + cMath)) * 100}%
`;
    }
    let box = document.createElement("div");
    box.style =
      "background: black; color: white; padding: 1rem; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 3px 3px 10px #00000055;";
    box.id = "scorecard";
    let el = document.createElement("pre");
    el.style = "font-family: sans-serif;";
    el.textContent = output;

    let button = document.createElement("button");
    button.addEventListener("click", (e) => {
      window.navigator.clipboard.writeText(output);
      e.target.textContent = "copied";
    });
    button.style = "width: fit-content; display: block; margin: 1rem 0 0 auto;";
    button.textContent = "COPY";
    let close = document.createElement("button");
    close.addEventListener("click", (e) => {
      let scorecard = document.getElementById("scorecard");
      scorecard.remove();
    });
    close.style = "width: fit-content; display: block; margin: 1rem 0 0 auto;";
    close.textContent = "Close to view question list";

    box.append(el, button);
    box.append(el, close);

    document.body.appendChild(box);
  };
  button.style = `
    position:fixed;
    height:50px;
    length:100px;
    top:2%;
    right:2%;
    font-size:20px;
    `;
  document.body.appendChild(button);
}
scorecardGenerator();

let scoreCardInterval = setInterval(() => {
  if (
    !["bitsat-quiz.jee-adv.eu.org", "jeehub.vercel.app"].includes(
      document.location.hostname,
    )
  ) return clearInterval(scoreCardInterval);

  if (document.location.href.includes("mock-test")) {
    let scorecardButton = document.getElementById("scorecard-generator");
    if (!scorecardButton || scorecardButton.style.display == "none") return scorecardGenerator();
  } else {
    let scorecardButton = document.getElementById("scorecard-generator");
    if (scorecardButton) scorecardButton.style.display = "none";
  }
}, 1000);})();
