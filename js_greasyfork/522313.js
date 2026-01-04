// ==UserScript==
// @name         Lichess: Training: Stats for Current Run
// @version      1.1.0
// @author       pedro-mass
// @copyright    2024, Pedro Mass (https://github.com/pedro-mass)
// @description  When doing puzzles, this will show you your stats
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lichess.org
// @license      GNU GPLv3
// @match        https://lichess.org/training/*
// @match        https://lichess.org/training
// @namespace    http://tampermonkey.net/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/522313/Lichess%3A%20Training%3A%20Stats%20for%20Current%20Run.user.js
// @updateURL https://update.greasyfork.org/scripts/522313/Lichess%3A%20Training%3A%20Stats%20for%20Current%20Run.meta.js
// ==/UserScript==

const ids = {
  stats: "pm-stats",
};
const selectors = {
  results: ".result-empty",
  stats: `#${ids.stats}`,
  puzzleHolder: ".puzzle__session",
};
const constants = {
  failure: "result-false",
  success: "result-true",
};

waitForElement(document, selectors.results).then(() => {
  run();
  watchElement(document.querySelector(selectors.puzzleHolder), (changes) => {
    if (wasTextChange(changes)) return;

    run();
  });
});

// ------------------
// helper functions
// ------------------

/**
 * @param {MutationRecord[]} changes
 */
function wasTextChange(changes) {
  if (!changes || changes.length === 0) return;

  const firstChange = changes[0];

  return (
    firstChange.target.id === ids.stats && firstChange.type === "childList"
  );
}

// src: https://stackoverflow.com/a/47406751/2911615
function waitForElement(root, selector) {
  return new Promise((resolve, _reject) => {
    new MutationObserver(check).observe(root, {
      childList: true,
      subtree: true,
    });
    function check(_changes, observer) {
      let element = root.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    }
  });
}

function watchElement(root = document, onChange) {
  new MutationObserver(onChange).observe(root, {
    childList: true,
    subtree: true,
  });
}

function run() {
  const statsElem = getStatsElem();
  displayFailures(statsElem);
  let showFailures = true;

  statsElem.addEventListener("click", function flipDisplay() {
    showFailures = !showFailures;

    showFailures ? displayFailures(statsElem) : displaySuccesses(statsElem);
  });
}

function getResults() {
  return Array.from(document.querySelectorAll(selectors.results));
}

function getStatsElem() {
  return document.querySelector(selectors.stats) ?? createStatsElem();
}

function createStatsElem() {
  const statsElem = document.createElement("div");
  statsElem.id = ids.stats;
  document.querySelector(selectors.puzzleHolder).appendChild(statsElem);

  return statsElem;
}

function getStats() {
  const results = getResults();
  const failures = results.filter((x) =>
    Array.from(x.classList).includes(constants.failure)
  );
  const successes = results.filter((x) =>
    Array.from(x.classList).includes(constants.success)
  );

  return {
    total: results.length,
    failures: failures.length,
    successes: successes.length,
  };
}

function displayFailures(elem) {
  const { total, failures } = getStats();

  elem.textContent = `${failures} / ${total} failures`;
}

function displaySuccesses(elem) {
  const { total, successes } = getStats();

  elem.textContent = `${successes} / ${total} successes`;
}
