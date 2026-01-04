// ==UserScript==
// @name         Trainlog: ajouter un bouton même date
// @namespace    http://tampermonkey.net/
// @version      2025-03-09
// @description  Quelques améliorations de QoL sur le site Trainlog
// @author       Lucie D. <me at luclu7.fr>
// @match        https://trainlog.me/*/new/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529323/Trainlog%3A%20ajouter%20un%20bouton%20m%C3%AAme%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/529323/Trainlog%3A%20ajouter%20un%20bouton%20m%C3%AAme%20date.meta.js
// ==/UserScript==

(function () {
  "use strict"; // Correction: removed unnecessary parentheses

  const bigButtonStyle =
    "background: linear-gradient(to right, #207cca 0%,#9f58a3 100%); display: block; width: 150px; height: 40px; border-radius: 25px; border: none; color: #eee; font-weight: 700; box-shadow: 1px 4px 10px 1px #aaa;";

  // Group element selections together for better readability
  const elements = {
    originStation: document.getElementById("originStation"),
    destinationStation: document.getElementById("destinationStation"),
    operator: document.getElementById("operator"),
    newTripStartDate: document.getElementById("newTripStartDate"),
    newTripStartTime: document.getElementById("newTripStartTime"),
    newTripEndTime: document.getElementById("newTripEndTime"),
    submitBtn: document.getElementById("submit"),
  };

  // Create "Same Date" button
  const sameDateBtn = document.createElement("button");
  sameDateBtn.innerHTML = "Même date";
  sameDateBtn.style = bigButtonStyle;
  sameDateBtn.addEventListener("click", () => {
    const newTripEndDate = document.getElementById("newTripEndDate");
    newTripEndDate.value = elements.newTripStartDate.value;
  });

  // Create SNCF operator button
  const setOperatorBtn = document.createElement("button");
  setOperatorBtn.innerHTML = "SNCF";
  setOperatorBtn.style =
    "background: linear-gradient(to right, #207cca 0%,#9f58a3 100%); border-radius: 25px; height: 2rem; border: none; color: #eee; font-weight: 700; box-shadow: 1px 4px 10px 1px #aaa;";
  setOperatorBtn.addEventListener("click", () => {
    elements.operator.value = "SNCF";
    const operatorLogo = document.querySelector(".operatorLogo");
    operatorLogo.src = "/static/images/operator_logos/SNCF.png";
  });

  // Add buttons to their respective groups
  const group = document.getElementById("dates");
  group.appendChild(sameDateBtn);

  const operatorGroup = document.getElementById("operatorGroup");
  operatorGroup.style = "display: flex; gap: 10px;";
  operatorGroup.appendChild(setOperatorBtn);

  // Set tab order for keyboard navigation
  const tabOrder = {
    originStation: 1,
    destinationStation: 2,
    operator: 3,
    newTripStartDate: 4,
    newTripStartTime: 5,
    newTripEndTime: 6,
    submitBtn: 7,
  };

  Object.entries(tabOrder).forEach(([key, value]) => {
    elements[key].tabIndex = value;
  });

  // Handle operator keyboard events
  const urlParams = new URLSearchParams(window.location.search);
  const hasPrevDest = urlParams.has("prevDest"); // Correction: use has() instead of comparing to undefined

  elements.operator.addEventListener("keydown", (event) => {
    if (elements.operator.value === "" && event.key === "Enter") {
      setOperatorBtn.click();

      const nextElement = hasPrevDest
        ? elements.newTripStartTime
        : elements.newTripStartDate;
      nextElement.focus();
      nextElement.select();
    }
  });
})();
