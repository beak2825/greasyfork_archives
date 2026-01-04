// ==UserScript==
// @name        AQA select all
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/aqa_select_all
// @include     *usablenet.com/*
// @exclude     none
// @version     3.0.1
// @grant    		none
// @description	Allows you to select all issues currently visible
// @downloadURL https://update.greasyfork.org/scripts/422238/AQA%20select%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/422238/AQA%20select%20all.meta.js
// ==/UserScript==

const SELECT_ALL_BUTTON_ID = 'SELECT_ALL_BUTTON_ID_92hotv782';

function expandAllCategories() {
  document
    .getElementsByClassName('sc-note--load-more--icon')
    .forEach(e => e.click());
}

function onSelectAll() {
  // Do this twice to make it more reliable
  expandAllCategories();
  expandAllCategories();

  const categoryElements = document.getElementsByClassName('sc-ruleIssue');

  for (let i = 0; i < categoryElements.length; i += 1) {
    const categoryElement = categoryElements[i];
    const checkboxes = categoryElement.getElementsByTagName('INPUT');
    for (let j = 0; j < checkboxes.length; j += 1) {
      const checkbox = checkboxes[j];
      checkbox.click();
    }
  }
}

function addButtonIfNecessary() {
  const currentButton = document.getElementById(SELECT_ALL_BUTTON_ID);
  if (currentButton) {
    return;
  }

  const manualReviewControlPanels = document.getElementsByClassName(
    'manual-review-filters',
  );
  if (!manualReviewControlPanels || manualReviewControlPanels.length < 1) {
    return;
  }

  const manualReviewControlPanel = manualReviewControlPanels[0];

  const selectButton = document.createElement('button');
  selectButton.innerText = `Toggle all`;
  selectButton.style.color = 'white';
  selectButton.style.fontSize = '1rem';
  selectButton.style.fontWeight = 'bold';
  selectButton.style.padding = '0.125rem 1.125rem';
  selectButton.id = SELECT_ALL_BUTTON_ID;
  selectButton.style.border = 'none';
  selectButton.style.backgroundColor = '#0770E3';
  selectButton.style.borderRadius = '0.5rem';
  // eslint-disable-next-line
  selectButton.onclick = onSelectAll;

  manualReviewControlPanel.appendChild(selectButton);
}

function worker() {
  try {
    addButtonIfNecessary();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

setInterval(worker, 1500);
