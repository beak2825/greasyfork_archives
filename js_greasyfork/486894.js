// ==UserScript==
// @name         Make branch name a link
// @namespace    http://tampermonkey.net/
// @version      2024-02-07
// @description  Makes the branch name in the "merged commit" message a link as well
// @author       Alexander M. Scheurer <ams@patentrenewal.com>
// @match        https://github.com/*/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_addElement
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486894/Make%20branch%20name%20a%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/486894/Make%20branch%20name%20a%20link.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let base_ref = document.querySelector(".base-ref");
  if (base_ref === null) return;

  let children = base_ref.children;

  let branch_name = base_ref.innerText;
  let href = `${document.location.href.split("/pull")[0]}/tree/${branch_name}`;

  let a = GM_addElement(base_ref, "a", {
    href,
  });
  for (let child of children) {
    child.remove();
    a.appendChild(child);
  }
})();
