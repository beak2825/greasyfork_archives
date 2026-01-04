// ==UserScript==
// @name         Breathe leave calculator: hours and minutes to days
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Show an estimation of available leave in days when it's calculated in hours
// @author       yndajas (they)
// @license      MIT
// @match        https://hr.breathehr.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=breathehr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474513/Breathe%20leave%20calculator%3A%20hours%20and%20minutes%20to%20days.user.js
// @updateURL https://update.greasyfork.org/scripts/474513/Breathe%20leave%20calculator%3A%20hours%20and%20minutes%20to%20days.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const leaveCardBodyElementSelector =
    "[data-element-id='my-leave-widget'] > .bdds-card__content > .bdds-card__body-top";

  const timeElement = () =>
    document.querySelector(`${leaveCardBodyElementSelector} h4`);

  const render = () => {
    if (!timeElement()) {
      return setTimeout(render, 1000);
    }

    const calculateDays = () => {
      return hours / dailyHours;
    };

    const updateDailyHoursValue = (newDailyHours) => {
      console.log("updateDailyHoursValue", newDailyHours);
      dailyHours = parseFloat(newDailyHours, 10);
      days = calculateDays();
      updateDaysValue();
    };

    const updateDaysValue = () => {
      daysElement.innerText = `~${days.toFixed(2)} days`;
    };

    const hoursAndMinutes = timeElement()
      .innerText.replace(" left", "")
      .split(" ")
      .map((time) => time.substring(0, time.length - 1));

    const hours =
      parseFloat(hoursAndMinutes[0], 10) +
      (hoursAndMinutes[1] ? hoursAndMinutes[1] / 60 : 0);

    let dailyHours = 7.75;
    let days = calculateDays();

    const leaveCardBodyElement = document.querySelector(
      leaveCardBodyElementSelector
    );

    const bodyColour = "#212529";
    const bodyFontClasses = [
      "bdds-text",
      "bdds-text--body-base",
      "bdds-text--style-normal",
      "bdds-text--weight-regular",
    ];

    const containerElement = document.createElement("div");
    containerElement.style.alignItems = "center";
    containerElement.style.display = "flex";
    containerElement.style.justifyContent = "space-between";
    containerElement.style.marginTop = "0.5rem";

    const daysElement = document.createElement("p");
    daysElement.classList.add(...bodyFontClasses);
    daysElement.style.color = bodyColour;
    daysElement.style.marginBottom = "0";
    updateDaysValue();

    const dailyHoursInputContainerElement = document.createElement("div");
    dailyHoursInputContainerElement.style.color = bodyColour;
    dailyHoursInputContainerElement.classList.add(...bodyFontClasses);

    const dailyHoursInputLabel = document.createElement("label");
    dailyHoursInputLabel.setAttribute("for", "dailyHours");
    dailyHoursInputLabel.innerText = "Hours per day:";
    dailyHoursInputLabel.style.marginBottom = "0";
    dailyHoursInputLabel.style.marginRight = "0.5rem";

    const dailyHoursInput = document.createElement("input");
    dailyHoursInput.id = "dailyHours";
    dailyHoursInput.style.fontSize = "1rem";
    dailyHoursInput.style.marginBottom = "0";
    dailyHoursInput.style.width = "3rem";
    dailyHoursInput.value = dailyHours;
    dailyHoursInput.addEventListener("keyup", (e) => {
      const newDailyHours = e.target.value;
      console.log("e.target.value:", newDailyHours);
      updateDailyHoursValue(newDailyHours);
    });

    dailyHoursInputContainerElement.append(
      dailyHoursInputLabel,
      dailyHoursInput
    );
    containerElement.append(daysElement, dailyHoursInputContainerElement);
    leaveCardBodyElement.append(containerElement);
  };

  render();
})();
