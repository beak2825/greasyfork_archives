// ==UserScript==
// @name         Geoguessr Average Score Display
// @namespace    https://greasyfork.org/en/users/1080671
// @version      0.2.1
// @description  Shows your average score over a set number of rounds. Displays past rounds with links to their results page.
// @author       Lemson
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479618/Geoguessr%20Average%20Score%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/479618/Geoguessr%20Average%20Score%20Display.meta.js
// ==/UserScript==



/***********************************************************************************/
/****************YOU NEED TO TURN OFF ANIMATION INGAME FOR THIS TO WORK*************/
/***********************************************************************************/
/**************IF YOU DO NOT TURN OFF ANIMATIONS THE SCRIPT WILL NOT WORK***********/
/***********************************************************************************/


(function () {
  "use strict";

  // Edit maxEntries to change the number of past games to include.
  const maxEntries = 4;

  //let userId = JSON.parse(document.getElementById('__NEXT_DATA__').innerText).props.accountProps.account.user.userId;

  const savedData = GM_getValue("savedData", { scores: [], urls: [] }) || { scores: [], urls: [] };
  let elementDetected = false;

 const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const targetElements = document.querySelectorAll('[data-qa="final-result-score"] > div');

    if (targetElements.length > 0) {
      if (!elementDetected) {
        const childText = targetElements[0].innerText;
        const scoreValue = parseInt(childText, 10);
        const currentUrl = window.location.href;

        const urlAlreadySaved = savedData.urls.includes(currentUrl);

        if (!urlAlreadySaved) {
          savedData.scores.push(scoreValue);
          savedData.urls.push(currentUrl);

          if (savedData.scores.length > maxEntries) {
            savedData.scores = savedData.scores.slice(savedData.scores.length - maxEntries);
            savedData.urls = savedData.urls.slice(savedData.urls.length - maxEntries);
          }

          GM_setValue("savedData", savedData);
        }

        const averageScore = savedData.scores.reduce((sum, value) => sum + value, 0) / savedData.scores.length;

        displayAverageScore(averageScore);
        displayScoresDropdown(savedData);

        elementDetected = true;
      }
    } else {
      elementDetected = false;
    }
  });
});

  //createElement function to make code better look
  function createElement(tag, attributes = {}, textContent = "") {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    element.textContent = textContent;
    return element;
  }

  // Show the average score on the screen
  function displayAverageScore(averageScore) {
    const resultContainer = document.querySelector('div[class^="result-overlay_overlayContent__"]');
    const averageScoreDiv = createElement("div", { style: "text-align: center; font-weight: bold;" });
    averageScoreDiv.innerHTML = `Average Score: ${averageScore.toFixed(2)} <br> (over ${maxEntries} rounds)`;
    resultContainer.appendChild(averageScoreDiv);
  }

  function displayScoresDropdown(data) {
    const resultContainer = document.querySelector('div[class^="result-overlay_overlayContent__"]');
    const dropdownContainer = createElement("div", { style: "text-align: center;" });
    const dropdown = createElement("select", { id: "scoreDropdown" });
    dropdown.style.cssText =
      "font-weight: bold; background-color: rgba(0,0,0,0.2); color: white; border: 1px black solid; width: 8rem; height: 1rem;text-align: center; border-radius: 2rem";

    //Put the score sin the dropdown thing.
    data.scores.forEach((score, index) => {
      const option = createElement("option", { value: index }, `Round ${index + 1}: ${score}`);
      option.style = "background-color: black; border:none;";
      dropdown.appendChild(option);
    });

    //When user click old round this takes them there.
    dropdown.addEventListener("change", (event) => {
      const selectedIndex = event.target.value;
      const selectedUrl = data.urls[selectedIndex];
      window.location.href = selectedUrl;
    });

    dropdownContainer.appendChild(dropdown);
    resultContainer.appendChild(dropdownContainer);
  }
  observer.observe(document.body, { childList: true, subtree: true });
})();