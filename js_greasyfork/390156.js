// ==UserScript==
// @name        Jira hide legend
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/jira_hide_legend
// @include     *gojira.skyscanner.net*
// @exclude     none
// @version     2
// @description:en	Hides the pointless legend.
// @grant    		none
// @description	Hides the pointless legend.
// @downloadURL https://update.greasyfork.org/scripts/390156/Jira%20hide%20legend.user.js
// @updateURL https://update.greasyfork.org/scripts/390156/Jira%20hide%20legend.meta.js
// ==/UserScript==

/* eslint-disable */

let tableGone = false;
let tableBackgroundGone = false;

function hideLegend() {
  if (tableGone) {
    return;
  }

  const tableElements = document.getElementsByTagName('TABLE');

  for (let i = 0; i < tableElements.length; i += 1) {
    const tableElement = tableElements[i];

    const tableElementText = tableElement.innerText;
    if (
      tableElementText.includes('Completed') &&
      tableElementText.includes('Commitment')
    ) {
      tableElement.style.display = 'none';
      tableGone = true;
      break;
    }
  }
}

function hideLegendBackground() {
  if (tableBackgroundGone) {
    return;
  }

  const divElements = document.getElementsByTagName('DIV');

  for (let i = 0; i < divElements.length; i += 1) {
    const divElement = divElements[i];

    if (
      divElement.style.backgroundColor === 'rgb(255, 255, 255)' &&
      divElement.style.opacity === '0.85'
    ) {
      divElement.style.display = 'none';
      tableBackgroundGone = true;
      break;
    }
  }
}

function worker() {
  try {
    hideLegend();
    hideLegendBackground();
  } catch (e) {
    console.log(e);
  }
}

setInterval(worker, 1500);
