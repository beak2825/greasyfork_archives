// ==UserScript==
// @name        Jira snazzy columns
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/jira_snazzy_columns
// @include     *gojira.*
// @exclude     none
// @version     2
// @description:en	Makes your jira board headings more snazzy, so that you stop getting them confused.
// @grant    		none
// @description	Makes your jira board headings more snazzy, so that you stop getting them confused.
// @downloadURL https://update.greasyfork.org/scripts/408483/Jira%20snazzy%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/408483/Jira%20snazzy%20columns.meta.js
// ==/UserScript==

function insertStyleSheetRule(ruleText) {
  const sheets = document.styleSheets;

  if (sheets.length === 0) {
    const style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
  }

  const sheet = sheets[sheets.length - 1];
  sheet.insertRule(
    ruleText,
    sheet.rules ? sheet.rules.length : sheet.cssRules.length,
  );
}

function snazzTitles() {
  const titleContainerElements = document.getElementsByClassName(
    'ghx-column-header-content',
  );
  for (let i = 0; i < titleContainerElements.length; i += 1) {
    const tCE = titleContainerElements[i];
    tCE.style.overflow = 'initial';
  }

  const titleElements = document.getElementsByClassName('ghx-column-title');
  for (let i = 0; i < titleElements.length; i += 1) {
    const tE = titleElements[i];
    tE.style.color = 'white';
    tE.style.background = 'red';
    tE.style.padding = '0.1rem 0.4rem';
    tE.style.animation = `spinIt${i % 2} 1s infinite`;
    tE.style.borderRadius = '2rem';
    tE.style.fontWeight = 'bold';
  }
}

function snazzTitlesIfNecessary() {
  snazzTitles();
}

function worker() {
  try {
    snazzTitlesIfNecessary();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

insertStyleSheetRule(
  '@keyframes spinIt0 { 0% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } 100% { transform: rotate(-20deg); } }',
);

insertStyleSheetRule(
  '@keyframes spinIt1 { 0% { transform: rotate(20deg); } 50% { transform: rotate(-20deg); } 100% { transform: rotate(20deg); } }',
);

// insertStyleSheetRule("@keyframes rubberBand { 0% { -webkit-transform: scale3d(1, 1, 1); transform: scale3d(1, 1, 1); } 30% { -webkit-transform: scale3d(1.25, 0.75, 1); transform: scale3d(1.25, 0.75, 1); } 40% { -webkit-transform: scale3d(0.75, 1.25, 1); transform: scale3d(0.75, 1.25, 1); } 50% { -webkit-transform: scale3d(1.15, 0.85, 1); transform: scale3d(1.15, 0.85, 1); } 65% { -webkit-transform: scale3d(.95, 1.05, 1); transform: scale3d(.95, 1.05, 1); } 75% { -webkit-transform: scale3d(1.05, .95, 1); transform: scale3d(1.05, .95, 1); } 100% { -webkit-transform: scale3d(1, 1, 1); transform: scale3d(1, 1, 1); } } @keyframes rubberBand { 0% { -webkit-transform: scale3d(1, 1, 1); transform: scale3d(1, 1, 1); } 30% { -webkit-transform: scale3d(1.25, 0.75, 1); transform: scale3d(1.25, 0.75, 1); } 40% { -webkit-transform: scale3d(0.75, 1.25, 1); transform: scale3d(0.75, 1.25, 1); } 50% { -webkit-transform: scale3d(1.15, 0.85, 1); transform: scale3d(1.15, 0.85, 1); } 65% { -webkit-transform: scale3d(.95, 1.05, 1); transform: scale3d(.95, 1.05, 1); } 75% { -webkit-transform: scale3d(1.05, .95, 1); transform: scale3d(1.05, .95, 1); } 100% { -webkit-transform: scale3d(1, 1, 1); transform: scale3d(1, 1, 1); } } ");

setInterval(worker, 1500);
