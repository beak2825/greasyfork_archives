// ==UserScript==
// @name Control Center status toggler
// @namespace http://bos-ernie.lss-manager.de
// @version 0.1
// @author BOS-Ernie; translated to US by tylernelson224
// @description Adds a button to each control center in the building list to toggle its status.
// @match https://www.missionchief.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at document-idle
// @grantnone
// @downloadURL https://update.greasyfork.org/scripts/454546/Control%20Center%20status%20toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/454546/Control%20Center%20status%20toggler.meta.js
// ==/UserScript==
/* global buildingLoadContent */
(function () {
  const callback = (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        addToggleButtons();
      }
    });
  };
  const observer = new MutationObserver(callback);
  observer.observe(document.getElementById("buildings"), {
    childList: true,
  });
  function addToggleButtons() {
    const buildingList = document.getElementById("building_list");
    if (!buildingList) {
      console.warn("No building list found.");
      return;
    }
    buildingList.querySelectorAll("li").forEach((li) => {
      if (li.getAttribute("building_type_id") !== "1") {
        return;
      }
      const buildingId = li.querySelector("img").getAttribute("building_id");
      const captionDiv = document.getElementById(
        "building_list_caption_" + buildingId
      );
      const img = li.querySelector("img");
      const imgSource = img.getAttribute("src");
      img.remove();
      if (imgSource === "/images/building_leitstelle_deactivated.png") {
        captionDiv.prepend(createStatusButtonGroup(buildingId, "disabled"));
      } else {
        captionDiv.prepend(createStatusButtonGroup(buildingId, "enabled"));
      }
    });
  }
  addToggleButtons();
  function createStatusButtonGroup(buildingId, status) {
    const href =
      "https://www.missionchief.com/buildings/" + buildingId + "/active";
    // Assign listener to variable
    const listener = (e) => {
      e.preventDefault();
      $.ajax({
        url: href,
        type: "GET",
        success: function () {
          buildingLoadContent("/buildings");
        },
      });
    };
    if (status === "disabled") {
      const enableButtonInactive = document.createElement("a");
      enableButtonInactive.href = href;
      enableButtonInactive.type = "button";
      enableButtonInactive.className = "btn btn-default";
      enableButtonInactive.innerHTML = "On";
      enableButtonInactive.addEventListener("click", listener);
      const disableButtonActive = document.createElement("a");
      disableButtonActive.href = href;
      disableButtonActive.type = "button";
      disableButtonActive.className = "btn btn-danger active";
      disableButtonActive.innerHTML = "Off";
      disableButtonActive.addEventListener("click", listener);
      const statusButtonGroupDisabled = document.createElement("div");
      statusButtonGroupDisabled.className = "btn-group btn-group-xs";
      statusButtonGroupDisabled.role = "group";
      statusButtonGroupDisabled.appendChild(enableButtonInactive);
      statusButtonGroupDisabled.appendChild(disableButtonActive);
      return statusButtonGroupDisabled;
    }
    const enableButtonActive = document.createElement("a");
    enableButtonActive.href = href;
    enableButtonActive.type = "button";
    enableButtonActive.className = "btn btn-success active";
    enableButtonActive.innerHTML = "On";
    enableButtonActive.addEventListener("click", listener);
    const disableButtonInactive = document.createElement("a");
    disableButtonInactive.href = href;
    disableButtonInactive.type = "button";
    disableButtonInactive.className = "btn btn-default";
    disableButtonInactive.innerHTML = "Off";
    disableButtonInactive.addEventListener("click", listener);
    const statusButtonGroupEnabled = document.createElement("div");
    statusButtonGroupEnabled.className = "btn-group btn-group-xs";
    statusButtonGroupEnabled.role = "group";
    statusButtonGroupEnabled.appendChild(enableButtonActive);
    statusButtonGroupEnabled.appendChild(disableButtonInactive);
    return statusButtonGroupEnabled;
  }
})();
