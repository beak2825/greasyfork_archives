// ==UserScript==
// @name         Auto add feature/tactical button after title
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  懒人必备
// @author       TabooSun
// @match        https://bitbucket.org/*/*/pull-requests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394768/Auto%20add%20featuretactical%20button%20after%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/394768/Auto%20add%20featuretactical%20button%20after%20title.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const featureText = "Feature";
  const tacticalText = "Tactical";

  function addEvent(btn, titleInput, text) {
    btn.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        for (const item of [featureText, tacticalText]) {
          if (titleInput.value.startsWith(`${item}/`)){
            titleInput.value = titleInput.value.replace(`${item}/`, "");
          }
        }
        titleInput.value = `${text}/${titleInput.value}`;
      },
      false
    );
  }

  function addButtons(element) {
    var btnStyle = 'style="padding:8px; border-radius: 8px; outline: none;"';
    const FEATURE_BTN = "myFeatureBtn";
    const TACTICAL_BTN = "myTacticalBtn";
    var featureBtnStr = `<button id="${FEATURE_BTN}" ${btnStyle}>
        Add Feature/
      </button>`;
    var tacticalBtnStr = `<button id="${TACTICAL_BTN}" ${btnStyle}>
        Add Tactical/
      </button>`;

    element.insertAdjacentHTML("beforeEnd", featureBtnStr + tacticalBtnStr);

    var titleInput = document.getElementById("id_title");
    var myFeatureBtn = document.getElementById(FEATURE_BTN);
    addEvent(myFeatureBtn, titleInput, featureText);
    var myTacticalBtn = document.getElementById(TACTICAL_BTN);
    addEvent(myTacticalBtn, titleInput, tacticalText);
  }

  window.addEventListener(
    "load",
    () => {
      var titleGroup = document.getElementById("id_title_group");
      addButtons(titleGroup);
    },
    false
  );
})();
