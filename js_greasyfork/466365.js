// ==UserScript==
// @name         Raid count view fix
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shows the raid count on Dragons of the Void website
// @author       infinity
// @match        https://play.dragonsofthevoid.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466365/Raid%20count%20view%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/466365/Raid%20count%20view%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
function registerEventListeners() {
  const element = document.querySelector(".raid-icon-background");
  if (element) {
    let tooltip = null;

    element.addEventListener("mouseover", () => {
      tooltip = document.createElement("div");
      tooltip.innerText = "Loading...";
      tooltip.style.position = "absolute";
      tooltip.style.backgroundColor = "black";
      tooltip.style.color = "white";
      tooltip.style.padding = "4px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.zIndex = "9999";

      const elementRect = element.getBoundingClientRect();
      tooltip.style.left = `${elementRect.left + window.scrollX}px`;
      tooltip.style.top = `${elementRect.bottom + window.scrollY}px`;

      document.body.appendChild(tooltip);

      fetch("https://api.dragonsofthevoid.com/api/user/info", {
        "headers": {
          "authorization": localStorage.getItem("token"),
        },
        "credentials": "include"
      })
        .then(response => response.json())
        .then(data => {
          tooltip.innerText = `${data.payload.user.counters.raidCount}/${data.payload.user.maxRaidCount}`;
        })
        .catch(error => {
          tooltip.innerText = "Error retrieving data";
        })
    });

    element.addEventListener("mouseout", () => {
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });
  } else {
    setTimeout(registerEventListeners, 1000);
  }
}

registerEventListeners();


})();