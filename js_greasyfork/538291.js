// ==UserScript==
// @name         NEET Score Checker(By neetandclear.in)
// @namespace    http://tampermonkey.net/
// @version      2025-06-05
// @description  Check NEET OMR score with a visual report, supports dark mode and dragging UI box.
// @author       Manab Bala
// @match        https://examinationservices.nic.in/NEET2025/OMRChallenge/ChallangeOMR.aspx
// @icon         https://www.neetandclear.in/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538291/NEET%20Score%20Checker%28By%20neetandclearin%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538291/NEET%20Score%20Checker%28By%20neetandclearin%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const response = [
    ];

    // Select all spans with id ending in 'Answer'
    const answerSpans = document.querySelectorAll('span[id$="Answer"]');

    // Example: Log all values
    answerSpans.forEach(span => {
        response.push(span.textContent);
    });

    const answerKey_45 = ['2', '2', '2', '4', '2', '2', '4', '4', '1', '1', '4', '1', '3', '3', '2', '2', '4', '2', '3', '1', '4', '2', '2', '3', '3', '3', '1', '4', '2', '3', '1', '2', '3', '2', '2', '2', '3', '1', '3', '2', '2', '3', '3', '4', '2', '4', '2', '2', '1', '1', '3', '3', '2', '4', '1', '4', '2', '4', '4', '4', '3', '2', '1,2', '1', '1', '2', '3', '2', '2', '3', '3', '1', '3', '1', '4', '1', '1', '2', '3', '3', '2', '2', '2', '1', '1', '3', '1', '4', '1', '4', '2', '2', '1', '4', '1', '1', '1', '1', '3', '3', '4', '2', '3', '4', '4', '3', '4', '4', '2', '1', '1', '1', '2', '4', '3', '1', '3', '1', '3', '4', '4', '2', '4', '4', '2', '4', '3', '1', '2', '2', '4', '2', '2', '3', '2', '1', '3', '1', '4', '1', '1', '1', '3', '1', '3', '1', '2', '4', '3', '4', '1', '1', '1', '3', '3', '4', '2', '1', '2', '2', '2', '2', '1', '2', '2', '2', '2', '2', '4', '3', '4', '1', '1', '3', '3', '2', '2', '1', '4', '2']
    const answerKey_46 = ['2', '2', '4', '2', '2', '1', '4', '1', '2', '2', '2', '3', '1', '1', '3', '3', '4', '3', '1', '1', '3', '1', '1', '1', '4', '1', '1', '1', '2', '2', '1', '1', '1', '1', '2', '4', '3', '3', '1', '1', '4', '2', '2', '3', '4', '2', '2', '2', '1', '1', '1', '2', '3', '2', '1', '1,4', '1', '3', '3', '3', '3', '1', '2', '3', '2', '1', '4', '4', '4', '4', '2', '4', '4', '3', '2', '3', '1', '3', '1', '4', '4', '4', '1', '1', '1', '4', '4', '4', '4', '2', '4', '3', '4', '1', '3', '4', '3', '2', '1', '2', '2', '1', '3', '3', '4', '4', '1', '1', '1', '2', '1', '4', '1', '1', '1', '4', '2', '2', '3', '2', '4', '4', '4', '4', '3', '4', '2', '1', '4', '2', '1', '4', '1', '4', '1', '3', '2', '1', '2', '3', '3', '1', '3', '4', '1', '1', '3', '4', '3', '4', '2', '2', '4', '4', '4', '2', '1', '3', '3', '4', '3', '3', '4', '2', '3', '4', '1', '1', '3', '2', '1', '3', '4', '2', '4', '1', '1', '1', '1', '2']
    const answerKey_47 = ['3', '2', '3', '3', '4', '2', '3', '3', '3', '2', '3', '4', '1', '1', '4', '3', '2', '4', '1', '3', '4', '3', '1', '4', '3', '1', '3', '1', '4', '2', '2', '1', '4', '1', '3', '3', '3', '3', '4', '4', '2', '3', '4', '3', '4', '4', '3', '1', '3', '2', '2', '3', '1', '3', '2', '2', '2', '2,3', '1', '4', '2', '4', '3', '4', '1', '4', '3', '1', '3', '4', '4', '2', '3', '2', '4', '1', '1', '3', '1', '1', '2', '3', '2', '3', '2', '2', '2', '4', '4', '3', '1', '3', '2', '4', '2', '2', '4', '4', '2', '2', '1', '3', '4', '2', '3', '4', '2', '4', '2', '1', '2', '3', '2', '1', '2', '4', '2', '3', '4', '3', '3', '3', '3', '1', '3', '2', '3', '3', '3', '4', '2', '3', '2', '1', '1', '2', '1', '3', '4', '3', '2', '3', '1', '1', '2', '1', '4', '1', '3', '2', '1', '2', '3', '4', '1', '4', '1', '4', '2', '1', '3', '3', '1', '3', '2', '3', '1', '4', '4', '2', '4', '2', '4', '1', '3', '3', '2', '2', '1', '3']
    const answerKey_48 = ['1', '4', '3', '1', '4', '4', '1', '4', '2', '1', '4', '4', '4', '2', '4', '4', '2', '2', '4', '4', '4', '3', '4', '2', '2', '1', '1', '4', '1', '2', '1', '2', '3', '1', '1', '1', '4', '3', '4', '3', '4', '3', '1', '3', '4', '4', '1', '2', '3', '4', '3,4', '1', '3', '3', '1', '1', '1', '2', '3', '2', '4', '3', '4', '3', '4', '1', '1', '2', '1', '4', '4', '1', '2', '3', '3', '2', '3', '4', '1', '4', '3', '3', '3', '4', '2', '2', '4', '2', '3', '4', '1', '1', '1', '1', '4', '4', '3', '1', '2', '4', '3', '3', '3', '1', '1', '2', '4', '4', '4', '3', '2', '2', '1', '4', '3', '4', '1', '4', '3', '1', '4', '1', '4', '3', '2', '2', '2', '2', '4', '4', '2', '3', '3', '4', '3', '3', '2', '4', '1', '4', '4', '3', '3', '2', '2', '3', '2', '4', '3', '4', '4', '2', '1', '2', '3', '2', '4', '3', '3', '3', '3', '1', '2', '4', '1', '3', '3', '4', '3', '2', '4', '1', '3', '1', '1', '4', '2', '4', '2', '3']


    const panel = document.createElement("div");
    panel.innerHTML = `
        <style>
            #neetScorePanel {
                position: fixed;
                top: 80px;
                right: 20px;
                background-color: #222;
                color: #fff;
                padding: 16px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 9999;
                font-family: sans-serif;
                width: 300px;
                cursor: move;
                user-select: none;
            }
            #neetScorePanel h2 {
                margin-top: 0;
                font-size: 18px;
                text-align: center;
            }
            #neetScorePanel select {
                margin: 8px 0;
                padding: 5px;
                width: 100%;
                background-color: #333; /* Dark background */
                color: #fff;            /* Light text */
                border: 1px solid #666;
                border-radius: 5px;
                appearance: none;       /* Optional: remove default arrow */
            }

            #neetScorePanel option {
                background-color: #333;
                color: #fff;
            }
            #neetScorePanel table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 14px;
            }
            #neetScorePanel th, #neetScorePanel td {
                padding: 5px;
                border: 1px solid #666;
                text-align: center;
            }
        </style>
        <div id="neetScorePanel">
            <h2>NEET Score Checker</h2>
            <label for="keySelect">Booklet Code:</label>
            <select id="keySelect" >
                <option value="45">Code 45</option>
                <option value="46">Code 46</option>
                <option value="47">Code 47</option>
                <option value="48">Code 48</option>
            </select>
            <div id="scoreTableContainer"></div>
        </div>
    `;
    document.body.appendChild(panel);

    const keyMap = {
        45: answerKey_45,
        46: answerKey_46,
        47: answerKey_47,
        48: answerKey_48
    };

    function getSubject(index) {
        if (index >= 0 && index < 45) return "Physics";
        if (index >= 45 && index < 90) return "Chemistry";
        return "Biology";
    }

    function calculateAndRenderReport(selectedKey) {
        const answerKey = keyMap[selectedKey];
        console.log("response:", response);
        console.log("answerKey", answerKey)
        const subjects = {
            Physics: { correct: 0, wrong: 0, skipped: 0 },
            Chemistry: { correct: 0, wrong: 0, skipped: 0 },
            Biology: { correct: 0, wrong: 0, skipped: 0 }
        };
        const subjectScore = { Physics: 0, Chemistry: 0, Biology: 0 };

        response.forEach((userAns, i) => {
            const subject = getSubject(i);
            const correctAns = answerKey[i];
            if (userAns === "-") {
                subjects[subject].skipped++;
                return;
            }

            const correctOptions = new Set(correctAns.split(","));
            if (correctOptions.has(userAns)) {
                subjects[subject].correct++;
                subjectScore[subject] += 4;
            } else {
                subjects[subject].wrong++;
                subjectScore[subject] -= 1;
            }
        });

        const report = {
            Physics: { ...subjects.Physics, score: subjectScore.Physics },
            Chemistry: { ...subjects.Chemistry, score: subjectScore.Chemistry },
            Biology: { ...subjects.Biology, score: subjectScore.Biology },
            Total: {
                correct: Object.values(subjects).reduce((sum, s) => sum + s.correct, 0),
                wrong: Object.values(subjects).reduce((sum, s) => sum + s.wrong, 0),
                skipped: Object.values(subjects).reduce((sum, s) => sum + s.skipped, 0),
                score: Object.values(subjectScore).reduce((sum, s) => sum + s, 0)
            }
        };

        const tableHTML = `
            <table>
                <thead>
                    <tr><th>Subject</th><th>✔️</th><th>❌</th><th>⏭️</th><th>Score</th></tr>
                </thead>
                <tbody>
                    <tr><td>Physics</td><td>${report.Physics.correct}</td><td>${report.Physics.wrong}</td><td>${report.Physics.skipped}</td><td>${report.Physics.score}</td></tr>
                    <tr><td>Chemistry</td><td>${report.Chemistry.correct}</td><td>${report.Chemistry.wrong}</td><td>${report.Chemistry.skipped}</td><td>${report.Chemistry.score}</td></tr>
                    <tr><td>Biology</td><td>${report.Biology.correct}</td><td>${report.Biology.wrong}</td><td>${report.Biology.skipped}</td><td>${report.Biology.score}</td></tr>
                    <tr><td>Total</td><td>${report.Total.correct}</td><td>${report.Total.wrong}</td><td>${report.Total.skipped}</td><td>${report.Total.score}</td></tr>
                </tbody>
            </table>
        `;
        document.getElementById("scoreTableContainer").innerHTML = tableHTML;
    }

    document.getElementById("keySelect").addEventListener("change", function () {
        calculateAndRenderReport(this.value);
    });
    calculateAndRenderReport("45");

    // Make panel draggable
    const panelDiv = document.getElementById("neetScorePanel");
    let isDragging = false;
    let offsetX, offsetY;

    panelDiv.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - panelDiv.offsetLeft;
        offsetY = e.clientY - panelDiv.offsetTop;
    });

    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            panelDiv.style.left = `${e.clientX - offsetX}px`;
            panelDiv.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
    });
})();