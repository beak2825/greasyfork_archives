// ==UserScript==
// @name        Login Pop-up Remover - derstandard.at
// @namespace   derstandard
// @match       https://www.derstandard.at/*
// @grant       none
// @version     1.1
// @author      oodeagleoo
// @license     MIT
// @description Removes Login Pop-up and re-enables scrolling on body element
// @require     https://cdn.jsdelivr.net/npm/@ryanmorr/ready@1.4.0
// @downloadURL https://update.greasyfork.org/scripts/443517/Login%20Pop-up%20Remover%20-%20derstandardat.user.js
// @updateURL https://update.greasyfork.org/scripts/443517/Login%20Pop-up%20Remover%20-%20derstandardat.meta.js
// ==/UserScript==

const waitFor = selector => new Promise(resolve => ready(selector, resolve));

const removeElement = element => element.parentElement.removeChild(element);

(async () => {
  const modalElements = await Promise.all(['.tp-modal', '.tp-backdrop'].map(waitFor));
  modalElements.forEach(removeElement);
  document.body.classList.remove('tp-modal-open');
})();
