// ==UserScript==
// @name Fix Workflowy shortcuts on Chromebook
// @namespace Violentmonkey Scripts
// @match https://workflowy.com/*
// @match https://beta.workflowy.com/*
// @grant none
// @description reverts CRTL+SHIFT+LEFT/RIGHT shortcuts to selection behaviour on Chomebook
// @version 0.0.1.20230109074223
// @downloadURL https://update.greasyfork.org/scripts/388097/Fix%20Workflowy%20shortcuts%20on%20Chromebook.user.js
// @updateURL https://update.greasyfork.org/scripts/388097/Fix%20Workflowy%20shortcuts%20on%20Chromebook.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.shiftKey && [37, 39].includes(event.keyCode)) {
    event.stopImmediatePropagation();
  }
});