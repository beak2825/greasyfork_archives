// ==UserScript==
// @version 0.2
// @name WorkFlowy CTRL SHIFT ARROW fix on Chromebook
// @description In Workflowy, it will fix the CTRL + SHIFT + [Left Arrow | Right Arrow] behaviour on Chromebook, making it select the text and not ident the task.
// @license MIT
// @match https://workflowy.com/
// @match https://beta.workflowy.com/
// @namespace https://greasyfork.org/users/1088658
// @downloadURL https://update.greasyfork.org/scripts/467652/WorkFlowy%20CTRL%20SHIFT%20ARROW%20fix%20on%20Chromebook.user.js
// @updateURL https://update.greasyfork.org/scripts/467652/WorkFlowy%20CTRL%20SHIFT%20ARROW%20fix%20on%20Chromebook.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.shiftKey && [37, 39].includes(event.keyCode)) {
    event.stopImmediatePropagation();
  }
}, true);

