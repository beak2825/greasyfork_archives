/**
 * MIT License
 *
 * Copyright (c) 2021 GreatWizard
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
// ==UserScript==
// @name            NanoRoms Decoder
// @namespace       https://greasyfork.org/en/users/781676-greatwizard
// @version         0.2
// @description     Decode links on nanoroms.com and disable adblock detector
// @author          GreatWizard (based on GlumWoodpecker work)
// @copyright       2021, GreatWizard (https://greasyfork.org/en/users/781676-greatwizard)
// @license         MIT
// @match           https://nanoroms.com/*
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/428765/NanoRoms%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/428765/NanoRoms%20Decoder.meta.js
// ==/UserScript==

// ==OpenUserScript==
// @author          GreatWizard
// @collaborator    GlumWoodpecker
// ==/OpenUserScript==

/* jshint esversion: 6 */
window.google_jobrunner = true;

setTimeout(() => {
  const bg = document.getElementsByClassName('matkATOeywyn-bg')[0];
  const modal = document.getElementsByClassName('matkATOeywyn')[0];
  bg.style.display = "none";
  modal.style.display = "none";
}, 2000);

let boxes = document.querySelectorAll(".su-box-content");

for (let i = 0; i < boxes.length; i++) {
  let currLines = unescape(boxes[i].innerHTML).split("\n");
  let finalString = "";

  for (let j = 0; j < currLines.length; j++) {
    if (currLines[j].startsWith("https://") || currLines[j].startsWith("http://")) {
      finalString += `<a href="${currLines[j]}" target="_blank">${currLines[j]}</a><br />`;
    } else {
      finalString += `${currLines[j]}<br />`;
    }
  }

  boxes[i].innerHTML = finalString;
}