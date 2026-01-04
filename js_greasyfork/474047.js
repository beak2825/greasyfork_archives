// ==UserScript==
// @name         Delete Get Started UI
// @namespace    https://prod.practitest.com/
// @version      1.0
// @description  Userscript to remove Practitest's Get Started UI
// @author       Baplisca
// @match        https://prod.practitest.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=practitest.com
// @grant        none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/474047/Delete%20Get%20Started%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/474047/Delete%20Get%20Started%20UI.meta.js
// ==/UserScript==

function deleteUI() {
  let checklist_elements = document.getElementsByClassName('appcues');
  for (let i = 0; i < checklist_elements.length; i++) {
    let e = checklist_elements[i];
    if (e) {
      e.parentNode.removeChild(e);
    }
  }
}

function execWorkflow() {
  deleteUI();
  let waitTime = 1000;
  setInterval(deleteUI, waitTime);
}

window.addEventListener('load', function () {
  execWorkflow();
});
