// ==UserScript==
// @name         ClickClickDrive Tastatur-Unterstützung
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Nummer-Tasten für Checkboxen, Leertaste für Weiter, Enter für Merken, (Leertaste tut nicht bei Zahlen-Fragen)
// @match        https://www.clickclickdrive.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507779/ClickClickDrive%20Tastatur-Unterst%C3%BCtzung.user.js
// @updateURL https://update.greasyfork.org/scripts/507779/ClickClickDrive%20Tastatur-Unterst%C3%BCtzung.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isAnimating = false;
    let lastAnswerState = null;

    // Create and inject the animation div
    const animationDiv = document.createElement('div');
    animationDiv.id = 'animation-overlay';
    animationDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      ovrflow:hidden;
    `;
    document.body.appendChild(animationDiv);

    function simulateClick(element) {
        if (element) {
            element.click();
        }
    }

    function handleKeyPress(event) {
        const key = event.key;
        const activeElement = document.activeElement;
        const isTargetURL = window.location.href.startsWith('https://www.clickclickdrive.de/theorie/');

        if (isTargetURL && key === ' ') {
            event.preventDefault();
            const buttons = [
                Array.from(document.querySelectorAll('button')).find(btn => btn.innerHTML.includes("Video abspielen")),
                document.querySelector('.PlayButton-sc-1m0g6ip-0'),
                Array.from(document.querySelectorAll('button')).find(btn => btn.innerHTML.includes("Antwortvarianten anzeigen")),
                document.querySelector('[data-test="QUESTION_NEXT_BUTTON"]'),
                document.querySelector('[data-test="RESULTS_PAGE_CLOSE_BUTTON"]')
            ];
            for (const button of buttons) {
                if (button && !button.disabled) {
                    simulateClick(button);
                    break;
                }
            }
        } else if (key >= '1' && key <= '5') {
            const checkboxes = document.querySelectorAll('[data-test="QUESTION_ANSWER_OPTION_CHECKBOX"]');
            const index = parseInt(key, 10) - 1;
            if (checkboxes[index]) {
                simulateClick(checkboxes[index]);
            }
        } else if (key === 'Enter') {
            const markButton = document.querySelector('.MarkButton__Wrapper-sc-1jns6xg-0');
            if (markButton) {
                markButton.setAttribute('data-waiting', 'true');
                simulateClick(markButton);
            }
        }
    }

    function focusInputField() {
        const inputField = document.querySelector('input');
        if (inputField) {
            inputField.focus();
        }
    }

    function checkAnswers() {
        if (isAnimating) return;

        const correctChosen = document.querySelector('[data-answer-type="CORRECT_ANSWER_CHOSEN"], input[style*="color: rgb(81, 227, 174)"]');
        const correctNotChosen = document.querySelector('[data-answer-type="CORRECT_ANSWER_NOT_CHOSEN"], input[style*="color: rgb(247, 70, 86)"], [data-answer-type="WRONG_ANSWER"]');

        const currentState = correctChosen && !correctNotChosen ? 'success' : correctNotChosen ? 'error' : null;

        if (currentState !== lastAnswerState) {
            lastAnswerState = currentState;

            if (currentState === 'success') {
                success();
            } else if (currentState === 'error') {
                error();
            }
        }
    }

    const observer = new MutationObserver((mutations) => {
        if (!isAnimating) {
            focusInputField();
            checkAnswers();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('keydown', handleKeyPress);

    const css = `

        @keyframes hurtFlash {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }
        @keyframes confettiAnimation {
            0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
            20% { transform: translateY(-50vh) rotate(180deg) scale(1); opacity: .7; }
            100% { transform: translateY(0) rotate(360deg) scale(0.3); opacity: 0; ; }
        }
        .gmQAwN {
            background-color: rgb(213, 213, 213) !important;
        }
        .kNeCvx {
            padding: 20px 15px !important;
        }
        .gTpmsk {
             padding: 16px 25px 20px 25px !important;
        }
        .hPptjs {  height: 60px !important;
        }
        .gRytUR::before {
  top: -5px !important;
  width: 70px !important;
  height: 70px !important;
  }
  .Wrapper-sc-1g7fm92-0,.ExamCard__Wrapper-c1otcr-0 {
  height: unset !important;}
  .cFangd {
  margin: 15px 0px -3px !important;
}
.cMqWmo {
  margin: 20px 0px -10px !important;
  font-size: 18px !important;
  color: rgb(53, 67, 84) !important;
  }
  .Wrapper-sc-1g7fm92-0 h4 + h3 {
  font-size: 12px !important;
  font-weight: normal !important;
  color: rgb(53, 67, 84) !important;
}
.klVNJx {
  margin-top: 10px;
}
.jthgel {
  overflow-x: auto !important;
}
.lcgXug {
  max-height: 100% !important;
  overflow: auto !important;
}
footer{
display:none;}
.kNeCvx {
  padding: 10px 15px !important;
}
header .aajiD {
  padding: 0 !important;
  font-size: 13px !important;
  box-shadow: none !important;
}
aside{
overflow-x: hidden !important;}
aside button{
flex-direction: column;}
aside button *{
margin-top: 10px;
}
aside a{

text-align: center;}
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    const parentStyle = document.createElement('style');
    parentStyle.type = 'text/css';
    parentStyle.appendChild(document.createTextNode('.List__ListItem-sc-1sexzs7-1-parent { counter-reset: list-item; }'));
    document.head.appendChild(parentStyle);

    function error() {
        isAnimating = true;
        const hurtOverlay = document.createElement('div');
        hurtOverlay.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          box-shadow: inset 0 0 50px 20px rgba(255, 0, 0, 0.8);
          animation: hurtFlash 0.7s ease-out;
        `;
        animationDiv.appendChild(hurtOverlay);

        setTimeout(() => {
            animationDiv.removeChild(hurtOverlay);
            isAnimating = false;
        }, 700);
    }

    function success() {
        isAnimating = true;
        const confettiCount = 100;
        const colors = ['#00ff00', '#22dd22', '#44bb44', '#669966'];
        let confettiElements = [];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            const size = Math.random() * 10 + 5;
            const leftPosition = Math.random() * 100;
            const animationDuration = Math.random() * 0.7 + 0.6;

            confetti.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              background-color: ${colors[Math.floor(Math.random() * colors.length)]};
              bottom: -${size}px;
              left: ${leftPosition}vw;
              animation: confettiAnimation ${animationDuration}s ease-in-out;
            `;
            animationDiv.appendChild(confetti);
            confettiElements.push(confetti);
        }

        setTimeout(() => {
            confettiElements.forEach(el => animationDiv.removeChild(el));
            isAnimating = false;
        }, 1500);
    }



})();