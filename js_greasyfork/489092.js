// ==UserScript==
// @name         Show Udemy Time Remaining
// @namespace    Namespace (usually a URL)
// @version      1.0.0
// @description  Gets time remaining for any modules in a Udemy course
// @author       lundeen-bryan
// @match        https://www.udemy.com/*
// @grant        GM_registerMenuCommand
// @icon         URL of an icon for the script
// @license      License information (e.g., MIT, GPL)
// @downloadURL https://update.greasyfork.org/scripts/489092/Show%20Udemy%20Time%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/489092/Show%20Udemy%20Time%20Remaining.meta.js
// ==/UserScript==

/**
 *
 * Name..............: Show Udemy Time Remaining
 * Description.......: This script enhances Udemy course pages by calculating and displaying the total remaining time for uncompleted modules.
 *                     It automatically identifies unwatched course content and sums up the durations, providing a quick overview of the time
 *                     required to complete the course. Additionally, it adds convenient buttons to the course interface for expanding all
 *                     sections, collapsing all sections, and showing the total remaining time.
 * Syntax............: The script operates automatically on Udemy course overview pages that contain '#overview' in the URL. It also provides
 *                     buttons for manual control. (Currently needs user to click the button * in the Udemy menu)
 * Parameters........: None.
 * Return data type..: Void. The script directly modifies the webpage content without returning data.
 * Links.............: n/a
 * Author............: lundeen-bryan
 * Related...........: This script is specific to Udemy courses and is designed to work with the current structure of Udemy's course content
 *                     pages as of the script's last update.
 * Example...........: To see the script in action, navigate to a Udemy course overview page (the URL should contain '#overview') and observe
 *                     the added "Remaining Time" display and control buttons. Manual triggers are available through the Tampermonkey extension
 *                     menu under "Activate Udemy Time Tracker."
 *
 */

(function () {
  "use strict";

  function initializeScript() {
    "use strict";

    // Check if the URL fragment includes '#overview'
    if (!location.hash.includes("overview")) {
      console.log("Not on the overview page, script will not run.");
      return; // Exit the script if not on the overview page
    }

    // Call main function
    addScriptButton();
    fetchAndDisplayCourseData();
  }

  function getMetaContentByName(name) {
    const element = document.querySelector(`meta[name="${name}"]`);
    return element && element.getAttribute("content");
  }

  function storeCourseMetadata(data) {
    localStorage.setItem("courseMetadata", JSON.stringify(data));
  }

  function expandUnopenedSections() {
    const unopenedSections = [];
    document
      .querySelectorAll(".section--section--yXfqc > span")
      .forEach((section) => {
        const isExpanded = section.getAttribute("data-checked") === "checked";
        if (!isExpanded) {
          const accordionTitle = section.parentNode.querySelector(
            ".ud-accordion-panel-heading"
          );
          if (accordionTitle) {
            accordionTitle.click();
            unopenedSections.push(section);
          } else {
            console.warn(
              "Could not find the accordion panel heading for one of the sections. The website structure might have changed."
            );
          }
        }
      });
    return unopenedSections;
  }

  function calculateTotalMinutes() {
    let totalMinutes = 0;
    document
      .querySelectorAll(".item-link.ud-custom-focus-visible")
      .forEach((item) => {
        const isChecked = item.querySelector(".ud-real-toggle-input").checked;
        if (!isChecked) {
          const timer = item.querySelector(".ud-text-xs span");
          if (timer) {
            let time = parseInt(timer.innerText.replace("min", "").trim(), 10);
            totalMinutes += isNaN(time) ? 0 : time;
          }
        }
      });
    return totalMinutes;
  }

  function convertDuration(totalMinutes) {
    const hours = String(Math.trunc(totalMinutes / 60)).padStart(2, "0");
    const minutes = String(totalMinutes % 60).padStart(2, "0");
    return { hours, minutes };
  }

  function collapseSections(sections) {
    sections.forEach((section) => {
      const accordionTitle = section.parentNode.querySelector(
        ".ud-accordion-panel-heading"
      );
      if (accordionTitle) {
        accordionTitle.click();
      } else {
        console.warn(
          "Could not find the accordion panel heading for one of the sections while trying to collapse. The website structure might have changed."
        );
      }
    });
  }

  function insertRemainingDuration(totalMinutes) {
    const { hours, minutes } = convertDuration(totalMinutes);
    const displayArea = document.querySelector(
      'dd[data-purpose="course-additional-stats"]'
    );
    if (displayArea) {
      const existingVideoDuration = displayArea.querySelector(
        "div:nth-child(2)"
      );
      const existingRemainingTimeElement = displayArea.querySelector(
        ".remaining-time"
      );

      if (existingRemainingTimeElement) {
        existingRemainingTimeElement.textContent = `Remaining Time: ${hours}:${minutes}`;
      } else {
        const remainingTimeElement = document.createElement("div");
        remainingTimeElement.textContent = `Remaining Time: ${hours}:${minutes}`;
        remainingTimeElement.className = "remaining-time";
        remainingTimeElement.style.backgroundColor = "yellow"; // Set the background color to yellow
        existingVideoDuration.insertAdjacentElement(
          "afterend",
          remainingTimeElement
        );
      }
    }
  }

  function addScriptButton() {
    const statsSection = document.querySelector(
      'dd[data-purpose="course-additional-stats"]'
    );
    if (!statsSection) return;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "10px";

    // Button for Remaining Time
    const remainingTimeButton = document.createElement("button");
    remainingTimeButton.id = "courseMetadataButton";
    remainingTimeButton.textContent = "Remaining Time";
    remainingTimeButton.style.backgroundColor = "#007bff";
    remainingTimeButton.style.color = "#fff";
    remainingTimeButton.style.border = "none";
    remainingTimeButton.style.padding = "10px";
    remainingTimeButton.style.cursor = "pointer";
    remainingTimeButton.style.display = "block"; // ensures each button takes up the full width of the container
    remainingTimeButton.style.marginBottom = "5px"; // adds a little space between buttons
    remainingTimeButton.addEventListener("click", () => {
      fetchAndDisplayCourseData();
    });
    buttonContainer.appendChild(remainingTimeButton);

    // Button for Expand All
    const expandAllButton = document.createElement("button");
    expandAllButton.textContent = "Expand All";
    expandAllButton.style.backgroundColor = "#008000";
    expandAllButton.style.color = "#fff";
    expandAllButton.style.border = "none";
    expandAllButton.style.padding = "10px";
    expandAllButton.style.cursor = "pointer";
    expandAllButton.style.display = "block"; // ensures each button takes up the full width of the container
    expandAllButton.style.marginBottom = "5px"; // adds a little space between buttons
    expandAllButton.addEventListener("click", () => {
      expandAllSections();
    });
    buttonContainer.appendChild(expandAllButton);

    // Button for Collapse All
    const collapseAllButton = document.createElement("button");
    collapseAllButton.textContent = "Collapse All";
    collapseAllButton.style.backgroundColor = "#ff0000";
    collapseAllButton.style.color = "#fff";
    collapseAllButton.style.border = "none";
    collapseAllButton.style.padding = "10px";
    collapseAllButton.style.cursor = "pointer";
    collapseAllButton.style.display = "block"; // ensures each button takes up the full width of the container
    collapseAllButton.addEventListener("click", () => {
      collapseAllSections();
    });
    buttonContainer.appendChild(collapseAllButton);

    statsSection.parentNode.insertBefore(
      buttonContainer,
      statsSection.nextSibling
    );
  }

  function expandAllSections() {
    document
      .querySelectorAll(".section--section--yXfqc > span")
      .forEach((section) => {
        const isExpanded = section.getAttribute("data-checked") === "checked";
        if (!isExpanded) {
          const accordionTitle = section.parentNode.querySelector(
            ".ud-accordion-panel-heading"
          );
          if (accordionTitle) {
            accordionTitle.click();
          } else {
            console.warn(
              "Could not find the accordion panel heading for one of the sections. The website structure might have changed."
            );
          }
        }
      });
  }

  function collapseAllSections() {
    document
      .querySelectorAll(".section--section--yXfqc > span")
      .forEach((section) => {
        const isExpanded = section.getAttribute("data-checked") === "checked";
        if (isExpanded) {
          const accordionTitle = section.parentNode.querySelector(
            ".ud-accordion-panel-heading"
          );
          if (accordionTitle) {
            accordionTitle.click();
          } else {
            console.warn(
              "Could not find the accordion panel heading for one of the sections while trying to collapse. The website structure might have changed."
            );
          }
        }
      });
  }

  function fetchAndDisplayCourseData() {
    const title = getMetaContentByName("twitter:title");
    const url = getMetaContentByName("twitter:url");
    const description = getMetaContentByName("twitter:description");
    const totalMinutes = calculateTotalMinutes();

    const courseMetadata = {
      courseTitle: title,
      courseURL: url,
      courseDescription: description,
      remainingDuration: totalMinutes,
    };

    storeCourseMetadata(courseMetadata);
    insertRemainingDuration(totalMinutes);

    const sectionsToCollapse = expandUnopenedSections();
    collapseSections(sectionsToCollapse);
  }

  // Automatically attempt to run the script on page load
  initializeScript();

  // Register a Tampermonkey menu command to manually trigger the script
  GM_registerMenuCommand("Activate Udemy Time Tracker", initializeScript, "t");
})();
