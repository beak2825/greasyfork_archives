// ==UserScript==
// @name         WU PWS inHg to mb
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Converts inHg to mb on Wunderground PWS pages
// @author       w_biggs
// @match        https://www.wunderground.com/dashboard/pws/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407942/WU%20PWS%20inHg%20to%20mb.user.js
// @updateURL https://update.greasyfork.org/scripts/407942/WU%20PWS%20inHg%20to%20mb.meta.js
// ==/UserScript==

const convertInHg = function convertInHg(inHg) {
  return Math.round(inHg * 33.86389 * 100) / 100;
};

const replaceInHg = function replaceInHg(element) {
  let text = element.innerText;
  if (text) {
    if (text.includes('in')) {
      text = text.split(' in')[0];
    }
    const val = Number.parseFloat(text);
    // set 35 as a max legal value for inhg
    if (!Number.isNaN(val) && val < 35) {
      element.innerText = convertInHg(val);
    }
  }
}

const replaceAllInHg = function replaceAllInHg() {
  const currPressures = document.querySelectorAll('span.wu-unit-pressure span.wu-value');
  currPressures.forEach((currPressure) => {
    replaceInHg(currPressure);
  });
  const currPressureUnits = document.querySelectorAll('span.wu-unit-pressure span.wu-label span.ng-star-inserted');
  currPressureUnits.forEach((currPressureUnit) => {
    currPressureUnit.innerText = 'mb';
  });
  const chartGridLines = document.querySelectorAll('div.charts-canvas div:nth-child(5) text.tick-label');
  chartGridLines.forEach((chartGridLine) => {
    replaceInHg(chartGridLine);
  });
}

const mutationTarget = document.querySelector('app-root');

console.log(mutationTarget);

const observer = new MutationObserver((mutationsList) => {
  for (let i = 0; i < mutationsList.length; i += 1) {
    const mutation = mutationsList[i];
    if (mutation.type === 'childList' && mutation.addedNodes.length &&
      !(mutation.addedNodes.length === 1 && mutation.addedNodes[0].nodeType === Node.TEXT_NODE)) {
      console.log('mutation!');
      replaceAllInHg();
    }
  }
});

observer.observe(mutationTarget, { subtree: true, childList: true });

replaceAllInHg();