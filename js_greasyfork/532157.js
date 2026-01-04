// ==UserScript==
// @name         kinxlist.com Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to extract interest and experience ratings from the kinklist survey form
// @match        https://kinxlist.com/*
// @grant        none\
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532157/kinxlistcom%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/532157/kinxlistcom%20Downloader.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const interestLabels = {
    "5": "Essential",
    "4": "Exciting",
    "3": "Intriguing",
    "2": "Tolerate",
    "1": "Dislike",
    "0": "HARD LIMIT",
  };

  const experienceLabels = {
    "5": "Advanced",
    "4": "Moderate",
    "3": "Beginner",
    "2": "Expert",
    "1": "Tried Once",
    "0": "Never Tried",
  };

  const isLabelSelected = (label) => {
    const input = label.querySelector('input[type="radio"]');
    const style = getComputedStyle(label);
    return (
      input?.checked ||
      label.classList.contains("selected") ||
      style.borderColor === "rgb(255, 0, 0)" ||
      style.backgroundColor === "rgb(255, 0, 0)" ||
      style.outlineColor === "rgb(255, 0, 0)" ||
      label.className.toLowerCase().includes("selected") ||
      style.fontWeight === "700"
    );
  };

  const getSelectedRadioValue = (container) => {
    if (!container) return null;
    const labels = container.querySelectorAll("label");
    for (let label of labels) {
      if (isLabelSelected(label)) {
        const input = label.querySelector('input[type="radio"]');
        if (input) return input.value;
      }
    }
    return null;
  };

  const extractData = () => {
    const results = [];

    document.querySelectorAll(".question.Row").forEach((row) => {
      const label = row.querySelector(".questionLabel p")?.innerText?.trim();
      if (!label) return;

      let entry = [`\nActivity: ${label}`];
      let included = false;

      ["giving", "receiving"].forEach((role) => {
        const roleDiv = row.querySelector(`.${role}.containerDiv`);
        if (!roleDiv) return;

        const interestVal = getSelectedRadioValue(roleDiv.querySelector(".ratingdiv"));
        const experienceVal = getSelectedRadioValue(roleDiv.querySelector(".experienced"));

        if (interestVal !== null || experienceVal !== null) {
          included = true;
          entry.push(`  ${role.charAt(0).toUpperCase() + role.slice(1)}:`);
          if (interestVal !== null)
            entry.push(`    Interest: ${interestLabels[interestVal] || interestVal}`);
          if (experienceVal !== null)
            entry.push(`    Experience: ${experienceLabels[experienceVal] || experienceVal}`);
        }
      });

      if (included) results.push(entry.join("\n"));
    });

    const finalOutput = results.join("\n");
    console.clear();
    console.log(finalOutput);
    alert("✅ Output printed to console. Check DevTools (F12 → Console tab).");
  };

  const createButton = () => {
    const btn = document.createElement("button");
    btn.textContent = "📋 Parse Kinklist";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
      padding: "10px 14px",
      backgroundColor: "#7c4dff",
      color: "white",
      fontSize: "14px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    });
    btn.onclick = extractData;
    document.body.appendChild(btn);
  };

  window.addEventListener("load", () => {
    setTimeout(createButton, 1500); // wait for dynamic elements to load
  });
})();
