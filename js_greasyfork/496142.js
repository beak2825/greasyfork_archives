// ==UserScript==
// @name        EXP Simulator - Hide Completed challenge
// @namespace   EXP Simulator
// @match       https://zakuro98.github.io/EXP-Simulator/*
// @grant       none
// @version     1.0.1
// @author      Judgy
// @description Add a toggle to hide completed challenges.
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/496142/EXP%20Simulator%20-%20Hide%20Completed%20challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/496142/EXP%20Simulator%20-%20Hide%20Completed%20challenge.meta.js
// ==/UserScript==

let hideCompletedButton = null;
let hideCompletedChallenges = true;

function getButtonText() {
  return hideCompletedChallenges ? 'HIDE COMPLETED' : 'SHOW COMPLETED';
}

function onToggleCompleted() {
  hideCompletedChallenges = !hideCompletedChallenges;
  updateChallengesDisplay();

  if (hideCompletedButton === null)
    return;

  hideCompletedButton.innerText = getButtonText();
}

function addToggleHideCompleted() {
  if (hideCompletedButton !== null)
    return;

  const buttonParent = document.getElementById('exit_center');
  if (buttonParent === null)
    return;

  hideCompletedButton = document.createElement('button');
  hideCompletedButton.id = 'hide_completed';
  hideCompletedButton.classList.add('button');
  hideCompletedButton.addEventListener('click', () => onToggleCompleted());
  hideCompletedButton.innerText = getButtonText();

  buttonParent.appendChild(hideCompletedButton);
}

function updateChallengesDisplay() {
  const maxCompletions = game.dk_bought[3] ? 20 : 12;

  for (const chg of challenge.challenges) {
    const element = challenge_map.get(chg);
    const completions = game.completions[chg.id - 1];

    if (completions >= maxCompletions && hideCompletedChallenges === true){
      element.classList.add('challenge_completed');
    } else {
      element.classList.remove('challenge_completed');
    }
  }

  addToggleHideCompleted();
}

function addEvents() {
  const challengesTab = document.getElementById('challenges_tab');
  if(challengesTab === null) {
    setTimeout(addEvents, 1000);
    return;
  }

  challengesTab.addEventListener('click', updateChallengesDisplay);
}

function addStylesheet() {
  const styles = `
    .challenge_completed {
      display: none !important;
    }
    #hide_completed {
      display: block;
      margin-top: 0.0714em;
      margin-bottom: 1em;
      margin-left: 1em;
    }`;

  const styleElem = document.createElement("style");
  styleElem.type = 'text/css';
  styleElem.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleElem);
}

function refreshLoop(prevChallenge, prevQuantum) {
  const curChallenge = game.challenge;
  const curQuantum = game.quantum;

  if ((curChallenge == 0 && prevChallenge > 0) || curQuantum > prevQuantum) {
    updateChallengesDisplay();
  }

  setTimeout(() => refreshLoop(curChallenge, curQuantum), 500);
}

addEvents();
addStylesheet();
refreshLoop(0, 0);