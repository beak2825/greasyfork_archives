// ==UserScript==
// @name        * Polizei Personalbeschaffer
// @namespace   bos-ernie.leitstellenspiel.de
// @version     1.0.0
// @license     BSD-3-Clause
// @author      BOS-Ernie edited by gonscher
// @description Wirbt 100 Personal, ohne Ausbildung und ohne Fahrzeugbindung, für eine Polizei-Wache an.
// @match       https://www.leitstellenspiel.de/buildings/*/hire
// @match       https://polizei.leitstellenspiel.de/buildings/*/hire
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// @resource    https://forum.leitstellenspiel.de/index.php?thread/24767-script-vorschau-bepo-personalbeschaffer-by-bos-ernie/
// @downloadURL https://update.greasyfork.org/scripts/529486/%2A%20Polizei%20Personalbeschaffer.user.js
// @updateURL https://update.greasyfork.org/scripts/529486/%2A%20Polizei%20Personalbeschaffer.meta.js
// ==/UserScript==

/* global $, loadedBuildings */

(function () {
  const minimalRemainingPersonnelInPoliceStation = 34;

  // https://api.lss-manager.de/de_DE/schoolings
  const personnelSettingsInternal = [
    {
      caption: "Ohne Ausbildung",
      key: null,
      numberOfRequiredPersonnel: 100,
      numberOfSelectedPersonnel: 0,
    },
      ];

  const personnelSettingsProxy = personnelSettingsInternal.map(setting => {
    return new Proxy(setting, {
      set: function (target, key, value) {
        target[key] = value;
        updateFooter(target.key, target.numberOfSelectedPersonnel);
        return true;
      },
    });
  });

  function initPanelBodies() {
    const elements = document.getElementsByClassName("panel-body");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add("hidden");
    }
  }
  function removePanelHeadingClickEvent() {
    const elements = document.getElementsByClassName("personal-select-heading");
    for (let i = 0; i < elements.length; i++) {
      elements[i].replaceWith(elements[i].cloneNode(true));
      elements[i].addEventListener("click", panelHeadingClickEvent);
    }
  }

  function addFooter() {
    const wrapper = document.createElement("div");
    wrapper.style = "display: flex; flex-wrap: wrap; flex-direction: row; column-gap: 15px";

    const list = document.createElement("ul");
    list.classList.add("list-inline");
    list.style = "color: #fff;padding-top: 8px;";

    for (let i = 0; i < personnelSettingsProxy.length; i++) {
      const setting = personnelSettingsProxy[i];

      list.appendChild(createTotalSummaryElement(setting));
    }

    wrapper.appendChild(list);

    const nav = document.querySelector(".navbar.navbar-default.navbar-fixed-bottom");

    nav.children[0].children[0].insertAdjacentElement("afterend", wrapper);
  }

  function updateFooter(key, selectedPersonnel) {
    document.getElementById("number-of-selected-personnel-" + key).innerHTML = selectedPersonnel;

    const requiredPersonnel = personnelSettingsProxy.find(setting => setting.key === key).numberOfRequiredPersonnel;

    const labelClass = selectedPersonnel === requiredPersonnel ? "label-success" : "label-warning";

    const spanPersonnel = document.getElementById("personnel-" + key);

    spanPersonnel.classList.remove("label-success", "label-warning");
    spanPersonnel.classList.add(labelClass);
  }

  function addClickEventHandlerToCheckboxes() {
    const inputElements = document.getElementsByClassName("schooling_checkbox");

    for (let i = 0; i < inputElements.length; i++) {
      inputElements[i].addEventListener("change", updateNumberOfSelectedPersonnel);
    }
  }

  function updateNumberOfSelectedPersonnel(event) {
    const attributes = Object.keys(event.target.attributes);

    let attributeIndex = attributes.find(key => event.target.attributes[key].value === "true");
    let key = null;
    if (attributeIndex !== undefined) {
      key = event.target.attributes[attributeIndex].name;
    }

    const setting = personnelSettingsProxy.find(setting => setting.key === key);

    if (event.target.checked) {
      setting.numberOfSelectedPersonnel = setting.numberOfSelectedPersonnel + 1;
    } else {
      setting.numberOfSelectedPersonnel = setting.numberOfSelectedPersonnel - 1;
    }

    const buildingId = event.target.getAttribute("building_id");

    const panelHeading = document.querySelector(".personal-select-heading[building_id='" + buildingId + "']");
  }

  function addPersonnelSelector() {
    let elements = document.getElementsByClassName("panel-heading personal-select-heading");
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const buildingId = element.getAttribute("building_id");
      element.children[1].prepend(createPersonnelSelector(buildingId));
    }
  }

  function createPersonnelSelector(buildingId) {
    const trashIcon = document.createElement("span");
    trashIcon.classList.add("glyphicon", "glyphicon-trash");

    const resetButton = document.createElement("button");
    resetButton.classList.add("btn", "btn-xs", "btn-default", "personnel-reset-button");
    resetButton.setAttribute("type", "button");
    resetButton.setAttribute("data-building-id", buildingId);
    resetButton.addEventListener("click", resetPersonnelClick);
    resetButton.appendChild(trashIcon);

    const buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group", "btn-group-xs");
    buttonGroup.setAttribute("role", "group");
    buttonGroup.appendChild(resetButton);
    buttonGroup.appendChild(createSelectButton(buildingId));

    return buttonGroup;
  }

  function createSelectButton(buildingId) {
    const userIcon = document.createElement("span");
    userIcon.classList.add("glyphicon", "glyphicon-user");

    const button = document.createElement("button");
    button.classList.add("btn", "btn-xs", "btn-default", "personnel-select-button");
    button.setAttribute("id", "personnel-select-button-" + buildingId);
    button.setAttribute("type", "button");
    button.setAttribute("data-building-id", buildingId);
    button.addEventListener("click", selectPersonnelClick);
    button.innerText = " Personal auswählen";
    button.prepend(userIcon);

    return button;
  }

  function createTotalSummaryElement(setting) {
    const listItem = document.createElement("li");

    const spanCaption = document.createElement("span");
    spanCaption.innerHTML = setting.caption + ": ";

    const spanSelected = document.createElement("span");
    spanSelected.setAttribute("id", "number-of-selected-personnel-" + setting.key);
    spanSelected.innerHTML = "0";

    const spanRequired = document.createElement("span");
    spanRequired.setAttribute("id", "number-of-required-personnel-" + setting.key);
    spanRequired.innerHTML = setting.numberOfRequiredPersonnel;

    const spanPersonnel = document.createElement("span");
    spanPersonnel.setAttribute("id", "personnel-" + setting.key);
    spanPersonnel.classList.add("label", "label-warning");
    spanPersonnel.appendChild(spanSelected);
    spanPersonnel.appendChild(document.createTextNode("/"));
    spanPersonnel.appendChild(spanRequired);

    listItem.appendChild(spanCaption);
    listItem.appendChild(spanPersonnel);

    return listItem;
  }

  async function selectPersonnelClick(event) {
    event.preventDefault();

    const button = event.target.closest("button");

    button.disabled = true;
    button.classList.remove("btn-default");
    button.classList.add("btn-success");

    const okIcon = document.createElement("span");
    okIcon.classList.add("glyphicon", "glyphicon-ok");
    button.replaceChild(okIcon, button.children[0]);

    const buildingId = button.dataset.buildingId;
    await selectPersonnel(buildingId);

    const panelBody = getPanelBody(buildingId);
    const numberOfSelectedPersonnel = panelBody.querySelectorAll("input:checked").length;

    button.innerHTML = button.innerHTML + " (" + numberOfSelectedPersonnel + ")";
  }

  async function resetPersonnelClick(event) {
    event.preventDefault();

    const resetButton = event.target.closest("button");
    const buildingId = resetButton.dataset.buildingId;

    const selectButton = createSelectButton(buildingId);

    document.getElementById("personnel-select-button-" + buildingId).replaceWith(selectButton);

    await resetPersonnel(buildingId);
  }

  async function selectPersonnel(buildingId) {
    await panelHeadingClick(buildingId);

    for (let i = personnelSettingsProxy.length - 1; i >= 0; i--) {
      const setting = personnelSettingsProxy[i];

      const panelBody = getPanelBody(buildingId);
      let inputElements = [];
      if (setting.key === null) {
        const schoolingCells = panelBody.querySelectorAll("td[id^='school_personal_education_']");
        for (let j = 0; j < schoolingCells.length; j++) {
          const schoolingCell = schoolingCells[j];
          // Personnel with anything but whitespace in schooling column, have a schooling and should not be selected
          if (schoolingCell.innerHTML.replace(/\s/g, "").length > 0) {
            continue;
          }

          inputElements.push(schoolingCell.parentElement.children[0].children[0]);
        }
      } else {
        inputElements = panelBody.querySelectorAll("input[" + setting.key + "='true']");
      }

      inputElements = Array.from(inputElements).filter(function (element) {
        if (typeof element === "undefined") {
          return false;
        }

        return element.parentElement.parentElement.children[3].innerHTML.replace(/\s/g, "").length === 0;
      });

      let j = inputElements.length - 1;
      while (setting.numberOfSelectedPersonnel < setting.numberOfRequiredPersonnel && j >= 0) {
        inputElements[j].click();
        --j;

        if (
          setting.key === null &&
          inputElements.length - setting.numberOfSelectedPersonnel <= minimalRemainingPersonnelInPoliceStation
        ) {
          break;
        }
      }
    }
  }

  function resetPersonnel(buildingId) {
    const panelBody = getPanelBody(buildingId);
    const inputElements = panelBody.querySelectorAll("input:checked");

    for (let i = 0; i < inputElements.length; i++) {
      inputElements[i].click();
    }
  }

  async function panelHeadingClickEvent(event) {
    // Skip redundant panelHeadingClick call which is handled by button click event
    if (
      event.target.classList.contains("personnel-select-button") ||
      event.target.classList.contains("glyphicon-trash")
    ) {
      return;
    }

    let buildingIdElement = event.target.outerHTML.match(/building_id="(\d+)"/);
    if (buildingIdElement === null) {
      buildingIdElement =
        event.target.parentElement.parentElement.parentElement.parentElement.outerHTML.match(/building_id="(\d+)"/);
    }

    await panelHeadingClick(buildingIdElement[1], true);
  }

  async function panelHeadingClick(buildingId, toggle = false) {
    const panelHeading = getPanelHeading(buildingId);
    const panelBody = getPanelBody(buildingId);
    const href = panelHeading.outerHTML.match(/href="([^"]+)"/)[1];

    if (loadedBuildings.indexOf(href) > -1) {
      if (toggle) {
        togglePanelBody(panelBody);
      }

      return;
    }

    loadedBuildings.push(href);
    await $.get(href, function (data) {
      panelBody.innerHTML = data;
    });

    const schoolingSelectAvailableButtons = panelBody.getElementsByClassName("schooling_select_available");
    for (let i = 0; i < schoolingSelectAvailableButtons.length; i++) {
      schoolingSelectAvailableButtons[i].parentElement.remove();
    }

    addClickEventHandlerToCheckboxes();

    if (toggle) {
      showPanelBody(panelBody);
    }
  }

  function togglePanelBody(panelBody) {
    if (panelBody.classList.contains("hidden")) {
      panelBody.classList.remove("hidden");
    } else {
      panelBody.classList.add("hidden");
    }
  }

  function showPanelBody(panelBody) {
    if (panelBody.classList.contains("hidden")) {
      panelBody.classList.remove("hidden");
    }
  }

  function getPanelHeading(buildingId) {
    return document.querySelector(".personal-select-heading[building_id='" + buildingId + "']");
  }

  function getPanelBody(buildingId) {
    return document.querySelector(".panel-body[building_id='" + buildingId + "']");
  }

  function main() {
    if (!window.location.href.match(/\/buildings\/\d+\/hire/)) {
      return;
    }

    const h1 = document.querySelector("h1[building_type]");
    if (!h1 || h1.getAttribute("building_type") !== "11") {
      return;
    }

    initPanelBodies();
    removePanelHeadingClickEvent();
    addPersonnelSelector();
    addFooter();
  }

  main();
})();
