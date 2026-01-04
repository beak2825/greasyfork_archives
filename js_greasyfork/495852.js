// ==UserScript==
// @name         Blooket Tools
// @namespace    http://greasyfork.org/
// @version      2.3.1
// @description  View All The Correct Answers on Blooket and speed up animations for improved performance.
// @author       You
// @match        https://*.blooket.com/*
// @exclude      https://play.blooket.com/play
// @exclude      https://cryptohack.blooket.com/play/hack
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495852/Blooket%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/495852/Blooket%20Tools.meta.js
// ==/UserScript==

(() => {
    let isQPressed = false;

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    document.addEventListener('keydown', debounce((event) => {
        if (event.key === 'q') {
            isQPressed = true;
            if (!document.getElementById('fast-animation-style')) {
                speedUpAnimations();
            }
            clickCorrectAnswers();
        }
    }, 50));

    document.addEventListener('keyup', debounce((event) => {
        if (event.key === 'q') {
            isQPressed = false;
        }
    }, 50));

    const clickCorrectAnswers = () => {
        if (!isQPressed) return;

        const { stateNode: { state, props } } = Object.values((function react(r = document.querySelector("body>div")) {
            return Object.values(r)[1]?.children?.[0]?._owner.stateNode ? r : react(r.querySelector(":scope>div"));
        })())[1].children[0]._owner;

        const question = state.question || props.client.question;
        const correctAnswers = question.correctAnswers;
        const answers = document.querySelectorAll(`[class*="answerContainer"]`);

        answers.forEach((answer, i) => {
            if (correctAnswers.includes(question.answers[i])) {
                answer.click(); // Automatically click the correct answer
            }
        });
    };

    const speedUpAnimations = () => {
        const style = document.createElement('style');
        style.id = 'fast-animation-style';
        style.innerHTML = `
            * {
                animation-duration: none !important;
                transition-duration: none !important;
            }
        `;
        document.head.appendChild(style);
    };
})();
