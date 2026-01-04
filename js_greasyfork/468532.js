// ==UserScript==
// @name         Copy Package | AUR
// @namespace    https://brightentompkins.com
// @version      0.1
// @license      MIT
// @description  Add option to copy package name.
// @author       vantaboard
// @match        https://aur.archlinux.org/packages/*
// @icon         https://avatars.githubusercontent.com/u/4673648
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468532/Copy%20Package%20%7C%20AUR.user.js
// @updateURL https://update.greasyfork.org/scripts/468532/Copy%20Package%20%7C%20AUR.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const packageBaseLink = document.querySelectorAll(
    "#pkginfo > tbody > tr > td > a"
  )?.[1];

  if (!packageBaseLink) {
    return;
  }

  const span = document.createElement("span");
  span.innerText = "(read-only, click to copy)";
  packageBaseLink.parentElement.appendChild(span);

  packageBaseLink.classList.add("copy");
  const style = document.createElement("style");
  style.innerText = `
        .copy {
            &:visited {
                color: #07b;
            }
        }
    `;

  document.head.appendChild(style);

  packageBaseLink.addEventListener("click", (event) => {
    event.preventDefault();

    navigator.clipboard.writeText(packageBaseLink.innerText);
  });
})();