// ==UserScript==
// @name          AO3: True Crossover Filter
// @author        Quihi
// @version       1.0
// @namespace     https://greasyfork.org/en/users/812553-quihi
// @icon          https://icons.duckduckgo.com/ip2/archiveofourown.org.ico
// @description   Help find real crossovers when fandoms have overlapping fandom tags.
// @license       MIT
// @match         https://archiveofourown.org/works?*
// @match         https://archiveofourown.org/tags/*/works*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/507488/AO3%3A%20True%20Crossover%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/507488/AO3%3A%20True%20Crossover%20Filter.meta.js
// ==/UserScript==

// the goal of this script is to hide from the page, fics which AO3 may count as crossovers but are not actually
// crossovers, because the tags are overlapping, e.g. various media types like a manga and anime.

("use strict");

document.addEventListener("DOMContentLoaded", () => {
  const mainFandomName = document.querySelector("#main > .heading > .tag").textContent;
  const mainFandomNameKey = encodeURI(mainFandomName);
  const scriptStorage = localStorage.getItem("crossoverScript") ? JSON.parse(localStorage.getItem("crossoverScript")) : {};
  const storedSameFandoms = scriptStorage[mainFandomNameKey] ? scriptStorage[mainFandomNameKey] : [];
  let hiddenFics = 0;

  // Create button to open/close menu
  function createOptionsButton() {
    const navigationBar = document.querySelector("div.navigation.actions");
    const optionsButton = document.createElement("ul");
    optionsButton.id = "crossoverScript-options-button";
    optionsButton.innerHTML = `<li><a href="#crossover-options">Crossover Helper Options</a></li>`;
    navigationBar.prepend(optionsButton);
    optionsButton.addEventListener("click", (event) => toggleMenu(event));
  }

  // Create an indicator for if the script is active and things are currently being hidden
  function updateIndicator() {
    let indicator = document.getElementById("crossoverScript-indicator");
    if (indicator === null) {
      indicator = document.createElement("span");
      indicator.id = "crossoverScript-indicator";
      document.getElementById("crossoverScript-options-button").after(indicator);
    }
    indicator.innerHTML = `${storedSameFandoms.length} 🔁 / ${hiddenFics} 🛑`;
    indicator.title = `${storedSameFandoms.length} fandom${storedSameFandoms.length === 1 ? " is" : "s are"} the same; ${hiddenFics} work${hiddenFics === 1 ? " is" : "s are"} hidden from this page`;
  }

  // Create a menu to let people select which fandoms should not count as crossovers
  // Buttons to select the top ten fandoms based on AO3 filters
  // Text entry field so people can add their own fandoms
  function createMenu() {
    const crossoverMenuWrapper = document.createElement("div");
    crossoverMenuWrapper.id = "crossoverScript-menu-wrapper";
    crossoverMenuWrapper.addEventListener("click", (event) => {
      // use if condition to avoid bubbling from child elements
      if (event.target === event.currentTarget) {
        toggleMenu(event);
      }
    });
    document.body.append(crossoverMenuWrapper);
    const colorAccent = window.getComputedStyle(document.querySelector('nav[aria-label="Site"] > ul'))["background-color"];
    const colorBG = window.getComputedStyle(document.getElementsByTagName("fieldset")[1])["background-color"];
    const colorFont = window.getComputedStyle(document.getElementsByTagName("fieldset")[1])["color"];
    const optionsMenuStyle = document.createElement("style");
    optionsMenuStyle.textContent = `
      #crossoverScript-menu-wrapper {
        --xover-script-color-accent: ${colorAccent};
        --xover-script-color-bg: ${colorBG};
        --xover-script-color-text: ${colorFont};
        position: fixed;
        top: 0px;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: color-mix(in srgb, var(--xover-script-color-bg, black) 65%, color(srgb 0 0 0 / 0));
        z-index: 9999;
        left: 0;
        opacity: 1;
        display: none;
      }
      #crossoverScript-menu-wrapper.active {
        display: flex;
      }
      #crossoverScript-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        background: var(--xover-script-color-bg, black);
        color: var(--xover-script-color-text, grey);
        padding: 1rem;
        border: 2px solid color-mix(in srgb, var(--xover-script-color-accent, red) 65%, black);
        border-radius: 0.3rem;
        max-height: 90vh;
        overflow: auto;
      }
      #crossoverScript-indicator {
        padding-left: 1em;
      }`;
    const crossoverMenu = document.createElement("div");
    crossoverMenuWrapper.append(optionsMenuStyle, crossoverMenu);
    crossoverMenu.id = "crossoverScript-menu";
    crossoverMenu.innerHTML = "<h1>Crossover Helper Settings</h1>";
    crossoverMenu.innerHTML += `<p>You are on the page for: ${mainFandomName}</p>`;
    crossoverMenu.innerHTML += "<p><strong>Which fandoms do you consider the same?</strong></p>";

    const fandomChecklist = document.createElement("ul");
    fandomChecklist.id = "crossoverScript-menu-checklist";
    fandomChecklist.classList.add("filters");
    crossoverMenu.append(fandomChecklist);

    const topTenFandoms = document.querySelectorAll("#include_fandom_tags label > span:last-child");
    topTenFandoms.forEach((fandom) => {
      const fandomName = fandom.textContent.replace(/(.*) \(\d+\)/, "$1");
      if (fandomName !== mainFandomName) {
        const fandomChecklistItem = document.createElement("li");
        fandomChecklistItem.innerHTML = `<label><input type="checkbox"><span class="indicator" aria-hidden="true"></span>${fandomName}</label>`;
        fandomChecklist.append(fandomChecklistItem);
      }
    });

    // fill in checkboxes with which are already checked from local storage
    // add items to list which are in local storage but not the top ten
    const pageProvidedFandomList = Array.from(document.querySelectorAll("#crossoverScript-menu-checklist input"));
    storedSameFandoms.forEach((fandom) => {
      const isFound = pageProvidedFandomList.some((providedFandom) => {
        if (providedFandom.parentElement.textContent === fandom) {
          providedFandom.checked = true;
          return true;
        }
        return false;
      });
      if (!isFound) {
        const newListItem = document.createElement("li");
        newListItem.innerHTML = `<label><input type="checkbox" checked="true"><span class="indicator" aria-hidden="true"></span>${fandom}</label>`;
        fandomChecklist.append(newListItem);
      }
    });

    // add free text entry box
    const customCrossoverEntryBox = document.createElement("div");
    customCrossoverEntryBox.style.display = "block";
    crossoverMenu.append(customCrossoverEntryBox);
    
    const customCrossoverEntryInput = document.createElement("input");
    customCrossoverEntryInput.type = "text";
    customCrossoverEntryInput.style.width = "18em";
    customCrossoverEntryInput.style.margin = "0.5em 0em 0em 0em";
    customCrossoverEntryInput.id = "crossoverScript-custom-entry-input";
    customCrossoverEntryBox.append(customCrossoverEntryInput);

    const customCrossoverButton = document.createElement("span");
    customCrossoverButton.classList.add("actions");
    customCrossoverButton.style.marginLeft = "0.25em";
    customCrossoverButton.style.float = "none";
    customCrossoverButton.innerHTML = `<a href="#crossover-options">Add to List</a>`;
    customCrossoverButton.addEventListener("click", (event) => addCustomCrossover(event));
    customCrossoverEntryBox.append(customCrossoverButton);

    // Buttons!
    const crossoverMenuNav = document.createElement("ul");
    crossoverMenuNav.classList.add("actions");
    crossoverMenu.append(crossoverMenuNav);

    // Add button to save filters
    const applyAndSaveFiltersButton = document.createElement("li");
    applyAndSaveFiltersButton.innerHTML = `<a href="#crossover-options">Apply & Save Filter</a>`;
    applyAndSaveFiltersButton.addEventListener("click", (event) => saveFilters(event));
    crossoverMenuNav.append(applyAndSaveFiltersButton);

    // Add button to clear filters
    const clearChecklistButton = document.createElement("li");
    clearChecklistButton.innerHTML = `<a href="#crossover-options">Clear Checklist</a>`;
    clearChecklistButton.addEventListener("click", (event) => clearChecklist(event));
    crossoverMenuNav.append(clearChecklistButton);

    // Add button to close without saving
    const closeNoSaveButton = document.createElement("li");
    closeNoSaveButton.innerHTML = `<a href="#crossover-options">Close Without Saving</a>`;
    closeNoSaveButton.addEventListener("click", (event) => toggleMenu(event));
    crossoverMenuNav.append(closeNoSaveButton);

    const menuFooter = document.createElement("p");
    menuFooter.textContent = 'This filter will be applied every time you open the page for this tag and filter "Show only crossovers".';
    crossoverMenu.append(menuFooter);
  }

  function addCustomCrossover(event) {
    event.preventDefault();
    const typedFandom = document.getElementById("crossoverScript-custom-entry-input").value.trim();
    if (typedFandom == "") {
      return;
    }
    const newListElem = document.createElement("li");
    newListElem.innerHTML = `<label><input type="checkbox" checked="true"><span class="indicator" aria-hidden="true"></span>${typedFandom}</label>`;
    document.getElementById("crossoverScript-menu-checklist").append(newListElem);
    document.getElementById("crossoverScript-custom-entry-input").value = "";
  }

  function clearChecklist(event) {
    event.preventDefault();
    const checkedFandoms = document.querySelectorAll("#crossoverScript-menu-checklist input:checked");
    checkedFandoms.forEach((checkbox) => {
      checkbox.checked = false;
    });
  }

  function toggleMenu(event) {
    if (event) {
      event.preventDefault();
    }
    const menu = document.getElementById("crossoverScript-menu-wrapper");
    menu.classList.toggle("active");
  }

  // For each fic, check if it is a fake crossover, and hide them.
  function filterWorks() {
    const displayedWorks = document.querySelectorAll("ol.work.group > li");
    const excludedFandoms = [...storedSameFandoms, mainFandomName];
    hiddenFics = 0;
    // Check each work on the page
    displayedWorks.forEach((work) => {
      // Get its fandom tags
      const workFandoms = Array.from(work.querySelectorAll("h5.fandoms > a.tag"));
      // It is a true crossover if one fandom from its tags is not on the list of excluded fandoms.
      const isTrueCrossover = workFandoms.some((fandom) => {
        return !excludedFandoms.includes(fandom.textContent);
      });
      if (!isTrueCrossover) {
        work.style.display = "none";
        hiddenFics += 1;
      }
    });
    updateIndicator();
  }

  // Store the information locally so it carries over to the next page
  function saveFilters(event) {
    event.preventDefault();
    const checkedFandoms = Array.from(document.querySelectorAll("#crossoverScript-menu-checklist input:checked"));
    storedSameFandoms.length = 0;
    checkedFandoms.forEach((fandom) => {
      storedSameFandoms.push(fandom.parentElement.textContent);
    });
    scriptStorage[mainFandomNameKey] = storedSameFandoms;
    localStorage.setItem("crossoverScript", JSON.stringify(scriptStorage));
    filterWorks();
    toggleMenu();
  }

  function init() {
    // Only run script if "Crossovers only" is selected
    // Make sure the setup isn't already done (i.e. from going forward and back pages)
    const isCrossoversOnly = document.querySelector("#work_search_crossover_t").checked;
    if (isCrossoversOnly) {
      createOptionsButton();
      createMenu();
      filterWorks();
    }
  }
  init();
});
