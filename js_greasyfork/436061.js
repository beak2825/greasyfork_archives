// ==UserScript==
// @name         Covid Screening Stuff
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Automatically complete the COVID screening for students :) (this was done in less than an hour)
// @author       You
// @match        https://covid-19.ontario.ca/school-screening/
// @icon         https://findicons.com/files/icons/1184/quickpix_2008/256/rick_roll_d.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436061/Covid%20Screening%20Stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/436061/Covid%20Screening%20Stuff.meta.js
// ==/UserScript==

(function () {
  const Start = () => {
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd");
    return button[0].click();
  };
  const Vaccinated = () => {
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd")[1];
    return button.click()
  };
  const Travelled = () => {
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd")[0];
    return button.click();
  };
  const Checklist = () => {
    const checkbox = document.getElementById("none_of_the_above");
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd")[0];
    checkbox.checked = true;
    return button.click();
  };
  const Positive = () => {
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd")[0];
    return button.click();
  };
  const Isolating = () => {
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd")[0];
    return button.click();
  };
  const Stay = () => {
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd")[0];
    return button.click();
  };
  const CloseContact = () => {
    const button = document.getElementsByClassName("button__StyledButton-sc-1hmy6jw-0 ibmPUd")[0];
    return button.click();
  };

  const functions = [Start, Vaccinated, Travelled, Checklist, Positive, Isolating, Stay, CloseContact];

  let interval = 1000;
  
  for (let func of functions) {
    setTimeout(func, interval);
    interval += 1000;
  }
})()