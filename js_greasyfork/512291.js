// ==UserScript==
// @name         Travel Clairvoyant
// @namespace    http://tampermonkey.net/
// @version      20241121205827626
// @description  Determines the type of travel being used.
// @author       Marches [3131483]
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512291/Travel%20Clairvoyant.user.js
// @updateURL https://update.greasyfork.org/scripts/512291/Travel%20Clairvoyant.meta.js
// ==/UserScript==
(() => {
  // ts/TravelClairvoyant.ts
  (() => {
    "use strict";
    const descriptions = ["", "Standard or BCT", "Private Island", "WLT Stock Block", "Unknown"];
    watchProfileStatus();
    function watchProfileStatus() {
      let statusSelector = ".profile-status";
      let element = document.querySelector(statusSelector);
      if (element) {
        updateElement(element);
      }
      let observer = new MutationObserver((mutations) => {
        if (!mutations.length) {
          return;
        }
        updateElement(mutations[0].target);
      });
      observer.observe(element ?? document.querySelector(statusSelector), {
        attributes: true,
        attributeFilter: ["class"]
      });
    }
    function updateElement(element) {
      let travelType = getTravelType(element);
      applyTravelDetails(element, travelType);
    }
    function getTravelType(element) {
      let classes = [...element.classList];
      if (classes.every((c) => c !== "travelling")) {
        return 0 /* None */;
      }
      if (classes.some((c) => c === "airstrip")) {
        return 2 /* PrivateIsland */;
      }
      if (classes.some((c) => c === "private")) {
        return 3 /* WltStockBlock */;
      }
      if (classes.some((c) => c === "from" || c === "to")) {
        return 1 /* StandardOrBct */;
      }
      console.warn("Could not determine travel type");
      return 4 /* Unknown */;
    }
    function applyTravelDetails(element, travelType) {
      let descriptionElement = element.querySelector(".sub-desc");
      if (!descriptionElement) {
        return;
      }
      if (travelType === 0 /* None */) {
        if (descriptionElement.textContent?.startsWith("Type:")) {
          descriptionElement.textContent = "";
        }
        return;
      }
      let descriptionContent = "Type: " + descriptions[travelType];
      if (travelType === 1 /* StandardOrBct */) {
        descriptionContent += guessStandardOrBct();
      }
      descriptionElement.textContent = descriptionContent;
    }
    function guessStandardOrBct() {
      let propertyType = getPropertyType();
      if (propertyType === null) {
        return "";
      }
      return propertyType === "Private Island" ? " (Probably BCT)" : " (Probably Standard)";
    }
    function getPropertyType() {
      let basicInformation = document.querySelector(".profile-container .info-table");
      let informationTitles = basicInformation.querySelectorAll("li");
      let propertyListItem = [...informationTitles].filter((t) => isPropertyListItem(t))[0];
      if (!propertyListItem) {
        return null;
      }
      return propertyListItem.querySelector(".user-info-value span span a").textContent;
    }
    function isPropertyListItem(element) {
      let sectionTitleText = element.querySelector(".user-information-section span").textContent;
      return sectionTitleText === "Property";
    }
  })();
})();
