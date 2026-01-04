// ==UserScript==
// @name        Make JIRA great again
// @namespace   chriskim06
// @description Brings back the beloved 'You suck!' button
// @include     https://trackr.atlassian.net/browse/TC-*
// @version     1.2
// @grant       none
// @locale      en
// @downloadURL https://update.greasyfork.org/scripts/31840/Make%20JIRA%20great%20again.user.js
// @updateURL https://update.greasyfork.org/scripts/31840/Make%20JIRA%20great%20again.meta.js
// ==/UserScript==

(function() {
  var buttons = document.querySelectorAll('.toolbar-trigger.issueaction-workflow-transition');
  buttons.forEach(function(button) {
    if (button.textContent === 'Re-Work') {
      button.textContent = 'You suck!';
      button.title = 'You suck! Try again you idiot!';
    }
  });
})();