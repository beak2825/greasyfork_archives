// ==UserScript==
// @name        AnswerIT Companion for Talentely
// @namespace   https://github.com/jeryjs
// @match       https://lms.talentely.com/*
// @grant       none
// @version     1.2
// @author      JeryJs
// @license     MIT
// @description Automatically selects answers on Talentely MCQs based on the AI response from my AnswerIT script.
// @downloadURL https://update.greasyfork.org/scripts/542935/AnswerIT%20Companion%20for%20Talentely.user.js
// @updateURL https://update.greasyfork.org/scripts/542935/AnswerIT%20Companion%20for%20Talentely.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let intervalId;
    let isRunning = false;
    let isReachedEnd = false;

    function startAnswering() {
        intervalId = setInterval(() => {
            try {
                let text = $('#ai-output-textarea').get(0).value;
                if (!text) return;

                let ch;
                const patterns = [
                    /Answer: (\d+)\s-\s.*$/,
                    /.*final answer is (\d+) - .*$/,
                    /.*final answer is \\$\\boxed{\\text{Answer: (\d+) - .*}}/
                ];
                for (const pattern of patterns) {
                    const match = text.match(pattern);
                    if (match && match[1]) {
                        ch = match[1]; // Extract the captured answer number
                        break;
                    }
                }

                if (ch) {
                    $('#question fieldset > div[aria-label="gender"] > label').get(ch - 1).click();
                    $('#question + div button').get(4).click();
                }

                if ($('div[variant="error"]')?.get(0)?.textContent == 'error_outlineThis is the Last questionclose') {
                    isReachedEnd = true;
                    stopAnswering();
                    alert("AnswerIT Companion:\nReached last question!! Please double check your answers")
                }
            } catch (e) {
                console.warn(`AnswerIT Companion: ` + e);
            }
        }, 1000);
    }

    function stopAnswering() {
        clearInterval(intervalId);
    }

    // Initial start of the answering process (set isRunning to true if u want script to always auto run)
    if (isRunning) startAnswering();

    const fab = document.createElement('button');
    fab.id = "ait_companion"
    fab.textContent = isRunning ? '⏸️' : '▶️';
    Object.assign(fab.style, {
        position: 'absolute',
        bottom: '0',
        right: '0',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e7e7e775',
        color: 'white',
        fontSize: '24px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: '10000'
    });

    // Toggle functionality
    fab.onclick = () => {
        if (isRunning) {
            stopAnswering();
            fab.textContent = '▶️';
            isRunning = false;
        } else {
            startAnswering();
            fab.textContent = '⏸️';
            isRunning = true;
            isReachedEnd = false;
        }
    };

    const attachFabInterval = setInterval(() => {
        const aiOutputContainer = $('#ai-output-container').get(0);
        if (aiOutputContainer) {
            aiOutputContainer.appendChild(fab);
            clearInterval(attachFabInterval); // Stop polling once attached
        }
    }, 500); // Poll every 500ms
})();