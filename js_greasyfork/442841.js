// ==UserScript==
// @name         WK Review Audio Switch
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Add switches to lessons and reviews to toggle autoplaying audio on or off
// @author       Gorbit99
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @grant        none
// @license      MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/442841/WK%20Review%20Audio%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/442841/WK%20Review%20Audio%20Switch.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.documentElement.addEventListener("turbo:load", async () => {
    if (!(location.pathname.startsWith("/subjects/lesson/quiz")
          || location.pathname.startsWith("/subjects/review")
          || location.pathname.startsWith("/subjects/extra_study"))) {
      return;
    }
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
    console.log("Loaded");
    autoplayController = Stimulus.controllers.find(x => "canPlay" in x);
    console.log(Stimulus.controllers);
    autoplay = autoplayController.autoPlayValue;
    inLessons = location.pathname.startsWith("/subjects/lesson/quiz");
    inReviews = location.pathname.startsWith("/subjects/review");
    inExtraStudy = location.pathname.startsWith("/subjects/extra_study");

    addSwitch();
  });

  let inLessons;
  let inReviews;
  let inExtraStudy;
  let autoplayController;

  let autoplay;

  function addSwitch() {
    const buttonContainer = document.querySelector(".character-header__menu-navigation");

    const button = document.createElement("span");
    button.innerHTML = `
    <i class="fa fa-volume-${autoplay ? "up" : "off"}"></i>
    `;

    button.style.color = "#fff";
    button.style.cursor = "pointer";
    button.style.width = "1em";
    button.style.display = "inline-block";
    button.style.marginLeft = "0.25em";

    let isTemp = false;

    button.addEventListener("click", () => {
      autoplay = !autoplay;
      autoplayController.autoPlayValue = autoplay;
      isTemp = false;

      const oldClass = autoplay ? "fa-volume-off" : "fa-volume-up";
      const newClass = autoplay ? "fa-volume-up" : "fa-volume-off";
      button.style.color = "#fff";

      button.querySelector("i").classList.replace(oldClass, newClass);

      handleChange();
    });

    button.addEventListener("contextmenu", (e) => {
      autoplay = !autoplay;
      autoplayController.autoPlayValue = autoplay;
      isTemp = !isTemp;

      const oldClass = autoplay ? "fa-volume-off" : "fa-volume-up";
      const newClass = autoplay ? "fa-volume-up" : "fa-volume-off";
      button.style.color = isTemp ? "red" : "white";

      button.querySelector("i").classList.replace(oldClass, newClass);

      e.preventDefault();
    });

    buttonContainer.append(button);
  };

  function handleChange() {
    let content = "_method=patch";

    if (inLessons) {
      content += `&user%5Blessons_autoplay_audio%5D=${autoplay}`;
    } else if (inReviews) {
      content += `&user%5Breviews_autoplay_audio%5D=${autoplay}`;
    } else if (inExtraStudy) {
      content += `&user%5Bextra_study_autoplay_audio%5D=${autoplay}`;
    }

    fetch("https://www.wanikani.com/settings/app.json", {
      "headers": {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-csrf-token": document.querySelector("[name='csrf-token']").content,
      },
      "body": content,
      "method": "POST",
    });
  }
})();