// ==UserScript==
// @name          Jira Workflow transitioner shortcuts
// @namespace     randomecho.com
// @description   Shortcut keys of > and < to trigger first two options in workflow transition.
// @include       https://*.atlassian.net/browse/*
// @include       */browse/*
// @grant         none
// @copyright     2017 Soon Van
// @author        Soon Van - randomecho.com
// @license       http://opensource.org/licenses/BSD-3-Clause
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/33658/Jira%20Workflow%20transitioner%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/33658/Jira%20Workflow%20transitioner%20shortcuts.meta.js
// ==/UserScript==

function transitionIssue(e) {
  var workflowTransitions = document.getElementsByClassName('issueaction-workflow-transition');

  if (!workflowTransitions[0])
    return;

  if (e.target.tagName.toLowerCase() === 'textarea')
    return;

  if (e.key === '>' || (e.shiftKey && e.keyCode === 190)) {
    workflowTransitions[0].click();
  } else if (e.key === '<' || (e.shiftKey && e.keyCode === 188) && workflowTransitions[1]) {
    workflowTransitions[1].click();
  }
}

document.addEventListener('keydown', transitionIssue, false);
