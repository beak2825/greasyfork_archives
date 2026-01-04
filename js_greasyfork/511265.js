// ==UserScript==
// @name         George the Spooder
// @namespace    https://greasyfork.org/en/users/434272-realalexz
// @version      0.1
// @description  Adds George to the forum.
// @author       RealAlexZ
// @icon         https://i.imgur.com/NouzJ6b.jpg
// @match        https://forum.turkerview.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511265/George%20the%20Spooder.user.js
// @updateURL https://update.greasyfork.org/scripts/511265/George%20the%20Spooder.meta.js
// ==/UserScript==

const georgeBody = document.querySelector(".spider");

if (!georgeBody) {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `
  <div class="spider spider_4">
    <div class="eye left"></div>
    <div class="eye right"></div>
    <span class="leg left"></span>
    <span class="leg left"></span>
    <span class="leg left"></span>
    <span class="leg left"></span>
    <span class="leg right"></span>
    <span class="leg right"></span>
    <span class="leg right"></span>
    <span class="leg right"></span>
  </div>
  `
  );

  document.querySelector(".spider_4").addEventListener("click", function () {
    this.remove();
  });
}
