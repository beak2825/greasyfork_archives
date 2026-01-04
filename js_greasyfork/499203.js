// ==UserScript==
// @name         OkCupid Filter
// @namespace    http://tampermonkey.net/
// @version      2024-06-27
// @description  Sifts through OkCupid profiles until we find people we want.
// @author       DaveFace
// @match        https://www.okcupid.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okcupid.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499203/OkCupid%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/499203/OkCupid%20Filter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Required keywords on page - note this could accidentally pick up someone who mentions these in their profile somewhere
  const keywordsRequired = [];

  // After finding a profile maching a required keyword, if one of these words appears in the profile, automatically pass
  const keywordsPass = [];

  // How fast to (try to) skip through profiles in ms i.e. 1000 = 1s
  // No idea if setting this too low is more or less likely to trigger some kind of bot detection
  const searchInterval = 300;

  // Variable to store the interval ID
  let searchLoop;

  // Variable to track the loop state
  let isLooping = false;

  const getProfileURL = () => {
    let matchButton = document.querySelector('[data-cy="discover.userCardMatchPercentage"]');
    if (matchButton) {
      return matchButton.href.replace("/questions?cf=quickmatch", "");
    }
    return "?";
  };

  const passProfile = () => {
    let passBtn = document.querySelector("button.dt-action-buttons-button.pass");
    if (passBtn) {
      passBtn.click();
    }
  };

  const likeProfile = () => {
    let likeBtn = document.querySelector("button.dt-action-buttons-button.like");
    if (likeBtn) {
      likeBtn.click();
    }
  };

  // Checks for keywords and handle actions
  const checkForKeywordsAndAct = () => {
    let profileText = document.body.innerText; // Get the text of the entire body

    // Check if one of the required keywords is on the page
    let found = keywordsRequired.some((keyword) => profileText.includes(keyword));

    if (found) {
      // Now check if there's any no-nos
      let pass = keywordsPass.some((keyword) => profileText.includes(keyword));
      if (pass) {
        console.log("Passing (partial match): " + getProfileURL());
        passProfile();
        return false;
      } else {
        return true;
      }
    } else {
      console.log("Passing (no match): " + getProfileURL());
      passProfile();
      return false;
    }
  };

  // Function to start the search loop
  const startSearchLoop = () => {
    if (isLooping) return; // Prevent starting multiple loops
    isLooping = true;

    searchLoop = setInterval(() => {
      if (checkForKeywordsAndAct()) {
        clearInterval(searchLoop); // Stop the loop if we match a profile
        isLooping = false;
      }
    }, searchInterval); // Adjust the interval time as needed
  };

  // Function to stop the search loop
  const stopSearchLoop = () => {
    clearInterval(searchLoop);
    isLooping = false;
    console.log("Search loop stopped.");
  };

  // Navigation keybinds
  let keyPressHandler = (ctx) => {
    switch (ctx.code) {
      case "KeyX":
        passProfile();
        startSearchLoop();
        break;
      case "KeyV":
        likeProfile();
        startSearchLoop();
        break;
      case "KeyN":
        stopSearchLoop();
        break;
      default:
        break;
    }
  };

  document.addEventListener("keydown", keyPressHandler);
})();

