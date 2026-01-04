// ==UserScript==
// @name         Videoele Complete Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       ToneTest
// @match        https://videoele.com/*
// @description Simple VideoEle Modifier
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531849/Videoele%20Complete%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/531849/Videoele%20Complete%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let savedQuestionCount = 0;
    let countHasBeenSet = false;

    function modifyElements() {
        if (!countHasBeenSet) {
            let questionCount = 0;
            const tableRows = document.querySelectorAll('tr');
            tableRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length === 4) {
                    if (cells[2] && cells[2].textContent === '⚫') {
                        questionCount++;
                    }
                }
            });
            
            if (questionCount > 0) {
                savedQuestionCount = questionCount;
                countHasBeenSet = true;
            }
        }

        const paragraphs = document.querySelectorAll('p.clinf-c.clinf-n');
        paragraphs.forEach(p => {
            p.classList.remove('clinf-n');
            p.classList.add('clinf-b');
        });

        const spans = document.querySelectorAll('span.clinf-cn');
        spans.forEach(span => {
            if (span.textContent.includes('%')) {
                span.textContent = ' 100%';
            }
        });

        const checkSpans = document.querySelectorAll('span.clinf-cn.clinf-b');
        checkSpans.forEach(span => {
            if (span.textContent.includes('✔') || span.textContent.match(/\b0\b/) || span.textContent.trim() === '0') {
                span.textContent = savedQuestionCount + ' ✔ ';
            }
        });

        const tableRows = document.querySelectorAll('tr');
        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 4) {
                if (cells[2] && cells[2].textContent === '⚫') {
                    cells[2].innerHTML = '<strong>✔</strong>';
                    cells[3].textContent = Math.floor(Math.random() * 4) + 1;
                }
            }
        });
    }

    let lastUrl = location.href;
    
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            countHasBeenSet = false;
            setTimeout(modifyElements, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

    modifyElements();

    window.addEventListener('load', () => {
        modifyElements();
        if (!countHasBeenSet) {
            setTimeout(modifyElements, 1500);
        }
    });

    setInterval(modifyElements, 2000);
})();