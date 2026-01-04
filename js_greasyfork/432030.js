// ==UserScript==
// @name         Add a scroll bar track to pymotw.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Teddy
// @match        https://pymotw.com/*
// @icon         https://www.google.com/s2/favicons?domain=pymotw.com
// @grant        none
// @description  Add a scroll bar track to pymotw.com, for macOS users
// @downloadURL https://update.greasyfork.org/scripts/432030/Add%20a%20scroll%20bar%20track%20to%20pymotwcom.user.js
// @updateURL https://update.greasyfork.org/scripts/432030/Add%20a%20scroll%20bar%20track%20to%20pymotwcom.meta.js
// ==/UserScript==

"use strict";

// @ts-ignore
let div = document.createElement("div");
document.body.append(div);
// @ts-ignore
const scrollbarWidth = 12;

function addScrollbarTrack() {
  const bodyColor = getComputedStyle(document.body).color;
  if (bodyColor === "rgb(255, 255, 255)") {
    div.style.cssText = `left: ${window.innerWidth - scrollbarWidth + "px"};
			 top: 0px;
			 width: ${scrollbarWidth + "px"};
			 height: ${window.innerHeight + "px"};
			 background-color: rgba(0, 0, 0, 0.18);
			 position: fixed;
			`;
    console.log("Scroll bar track style changed.");
  } else {
    console.log("Scroll bar track style NOT changed.");
  }
}

window.addEventListener("load", addScrollbarTrack);
window.addEventListener("resize", addScrollbarTrack);


