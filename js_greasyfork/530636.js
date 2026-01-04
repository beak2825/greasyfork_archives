// ==UserScript==
// @name        AP Classroom Hide Correct MCQ Answer
// @namespace   Violentmonkey Scripts
// @match       *://apclassroom.collegeboard.org/*
// @grant       none
// @version     1.0
// @author      murpyh
// @license     MIT
// @description 3/23/2025, 11:51:22 AM
// @downloadURL https://update.greasyfork.org/scripts/530636/AP%20Classroom%20Hide%20Correct%20MCQ%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/530636/AP%20Classroom%20Hide%20Correct%20MCQ%20Answer.meta.js
// ==/UserScript==

const css = `
.mcq-option.--correct ,
.mcq-option.--incorrect
{
  background-color: rgba(255,255,255,1) !important;
  border: 0 !important
}

.response-analysis-wrapper > .icon
{
  display: none;
}

.--chosen
{
  color: inherit !important;
  background-color: inherit !important;
}

.LearnosityDistractor
{
  display: none !important;
}
`;

// taken from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

let toggle, style;

function onToggleAnswerShowClicked() {
  if (toggle.checked) {
    style.media = 'all';
  } else {
    style.media = 'not all';
  }
}

function initElements() {
  const head = document.head || document.getElementsByTagName('head')[0];
  style = document.createElement('style');

  head.appendChild(style);
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));

  toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.name = 'toggleShowAnswer';
  toggle.checked = true;
  toggle.onclick = onToggleAnswerShowClicked;

  const label = document.createElement('label');
  label.for = toggle;
  label.innerHTML = 'Hide correct answer';

  waitForElm('.RI_header').then((header) => {
    header.appendChild(toggle);
    header.appendChild(label);
  });
}

initElements();

