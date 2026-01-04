// ==UserScript==
// @name         MobyMax Cheat Panel with Auto-Answer (ctrl shift z) to enable
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Show questions, student answers, correct answers, and auto-answer on MobyMax
// @match        https://www.mobymax.com/*
// @grant        none
// @author       ArmandoC + ChatGPT
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537014/MobyMax%20Cheat%20Panel%20with%20Auto-Answer%20%28ctrl%20shift%20z%29%20to%20enable.user.js
// @updateURL https://update.greasyfork.org/scripts/537014/MobyMax%20Cheat%20Panel%20with%20Auto-Answer%20%28ctrl%20shift%20z%29%20to%20enable.meta.js
// ==/UserScript==

/*
Copyright (c) 2025 Armando Cisneros
armandocisneros072013@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // Create panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '20px';
    panel.style.width = '400px';
    panel.style.height = '400px';
    panel.style.backgroundColor = 'white';
    panel.style.border = '2px solid #333';
    panel.style.padding = '10px';
    panel.style.overflowY = 'auto';
    panel.style.zIndex = '9999';
    panel.style.fontSize = '14px';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    panel.style.display = 'none';
    panel.style.whiteSpace = 'pre-wrap';

    // Add header
    const header = document.createElement('div');
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '8px';
    header.textContent = 'MobyMax Questions & Answers (Press Ctrl+Shift+Z to toggle)';
    panel.appendChild(header);

    document.body.appendChild(panel);

    function extractQA() {
        const problems = document.querySelectorAll('.problem-statement');
        let output = '';

        problems.forEach((problem, index) => {
            const clone = problem.cloneNode(true);
            clone.querySelectorAll('img, input').forEach(el => el.remove());
            const questionText = clone.innerText.trim();

            const answerInput = problem.querySelector('input.small_field, input.medium_field');
            const studentAnswer = answerInput ? answerInput.value.trim() : '';

            const feedbackWrapper = problem.closest('.lab-problem')?.querySelector('.feedback-wrapper-title');
            let correctAnswer = 'Not found';
            if (feedbackWrapper) {
                const bold = feedbackWrapper.querySelector('b');
                correctAnswer = bold ? bold.innerText.trim() : feedbackWrapper.innerText.trim();
            }

            output += `Q${index + 1}: ${questionText}\nStudent Answer: ${studentAnswer}\nCorrect Answer: ${correctAnswer}\n\n`;
        });

        panel.textContent = output || 'yuh i cant find nun sorry.';
    }

    function autoAnswer() {
        const problems = document.querySelectorAll('.problem-statement');

        problems.forEach((problem) => {
            const answerInput = problem.querySelector('input.small_field, input.medium_field');
            if (!answerInput) return;

            const feedbackWrapper = problem.closest('.lab-problem')?.querySelector('.feedback-wrapper-title');
            let correctAnswer = null;

            if (feedbackWrapper) {
                const bold = feedbackWrapper.querySelector('b');
                correctAnswer = bold ? bold.innerText.trim() : feedbackWrapper.innerText.trim();
            }

            if (correctAnswer && answerInput.value.trim() !== correctAnswer) {
                answerInput.value = correctAnswer;
                answerInput.dispatchEvent(new Event('input', { bubbles: true }));
                answerInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    }

    // Update panel content every 3 seconds and auto-answer always
    setInterval(() => {
        if (panel.style.display !== 'none') {
            extractQA();
        }
        autoAnswer();
    }, 3000);

    // Toggle panel with Ctrl + Shift + Z
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
            panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
        }
    });
})();
