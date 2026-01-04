// ==UserScript==
// @name           Mangadex Toggle Tags
// @namespace      https://github.com/ToostInc/userscripts
// @description    Hide or shows tags for spoiler purposes
// @include        /^https?:\/\/mangadex\.org\/title\/.*$/
// @author         Joost Bremmer < contact at made of magic and wires dot online >
// @copyright      2019, Joost Bremmer
// @license        MIT
// @version        1.0.6
// @date           2019-09-28
// @grant          none
// @runat          document-end
// @downloadURL https://update.greasyfork.org/scripts/390570/Mangadex%20Toggle%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/390570/Mangadex%20Toggle%20Tags.meta.js
// ==/UserScript==

/**
  * Mangadex Toggle Tags
  * Copyright © 2019 Joost Bremmer
  *
  * Permission is hereby granted, free of charge, to any person obtaining
  * a copy of this software and associated documentation files (the "Software"),
  * to deal in the Software without restriction, including without limitation
  * the rights to use, copy, modify, merge, publish, distribute, sublicense,
  * and/or sell copies of the Software, and to permit persons to whom the
  * Software is furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included
  * in all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
  * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

"use strict";


/**
 * Toggles the visibility state of tags
 *
 * @param {HTMLElement} container contains tag elements to show or hide
 * @param {Boolean} visibilityOverride overrides usual checks to force
 *                                     visibilty state
 * @return {undefined}
 **/
function toggleTags(container, visibilityOverride) {

  let toggleBtn = container.getElementsByClassName("toggleTags")[0];

  if(toggleBtn) {
    let tagsVisible = visibilityOverride ? visibilityOverride : ("hideTags" in toggleBtn.dataset);


    // loop tag anchors and toggle visibility state
    Array.prototype.forEach.call(container.getElementsByTagName("a"), anchor => {
      anchor.classList.toggle("display-none", !tagsVisible);
    });

    // toggle saved state
    toggleBtn.innerText = tagsVisible ? "Hide Tags" : "Show Tags";
    if("hideTags" in toggleBtn.dataset) {
      delete toggleBtn.dataset.hideTags;
    } else {
      toggleBtn.dataset.hideTags = "";
    }
  }
}

/**
 * Inserts a button that can be clicked to show or hide the tags
 * @param {HTMLElement} container parent element to insert button into
 * @return {undefined}
 *
 **/
function addToggleButton(container) {

  let toggleBtn = document.createElement("span");

  // set toggle button details
  toggleBtn.classList.add("badge", "badge-warning", "toggleTags");
  toggleBtn.style.minWidth = "60px";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.innerText = "Show Tags";
  toggleBtn.addEventListener("click", () => {
    // set visibility according to saved state
    toggleTags(container);

  });


  // insert toggle button
  container.innerHTML = "&nbsp;" + container.innerHTML;
  container.insertBefore(toggleBtn, container.childNodes[0]);
}

/**
 * Main function that runs the script; to be called once DOM is loaded
 * @return {undefined}
 **/
function main() {
  let tagfields = document.querySelectorAll("a[href^='/genre']");

  let containers = new Set(Array.prototype.map.call(tagfields, (anchor) => {
    return anchor.parentNode;
  }));

  containers.forEach((container) => {
    addToggleButton(container);
    toggleTags(container, false);
  });
}
main();

// vim: set ts=2 sts=2 sw=2 et :
