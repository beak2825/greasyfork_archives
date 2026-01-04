// ==UserScript==
// @name     SpaceApp Hide
// @version  1.3
// @grant    none
// @description hide spaceapp deals
// @match        https://spaceapp.ru/*
// @namespace https://greasyfork.org/users/1443482
// @downloadURL https://update.greasyfork.org/scripts/529174/SpaceApp%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/529174/SpaceApp%20Hide.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const currentPlan = document.getElementById("currentPlan");
  const newDeals = document.getElementById("newDeals");
  const failedDeals = document.getElementById("failedDeals");
  const priorityDeals = document.getElementById("priorityDeals");

  function hide(element) {
    if (element instanceof HTMLElement) {
      element.style.overflow = "auto";
      element.style.maxHeight = "250px";
    }
  }

  function calculate(element) {
    if (element instanceof HTMLElement) {
      const count = element.querySelectorAll("a").length;
      const titleElement = element.querySelector(".title strong");
      if (titleElement instanceof HTMLElement) {
        const title = titleElement.innerText;
        titleElement.innerText = `${title} ${count}`;
      }
    }
  }

  hide(newDeals);
  hide(failedDeals);
  hide(currentPlan);
  hide(priorityDeals);

  calculate(newDeals);
  calculate(failedDeals);
  calculate(currentPlan);
  calculate(priorityDeals);
})();
