// ==UserScript==
// @name         Sort Mega.nz files by size
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add sortbysize button on mega.nz
// @author       JethaLal_420
// @match        https://mega.nz/folder/*
// @icon         https://www.google.com/s2/favicons?domain=mega.nz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437430/Sort%20Meganz%20files%20by%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/437430/Sort%20Meganz%20files%20by%20size.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var listViewBtn, blockViewBtn;

  const createBtn = (btnName) => {
    var button = document.createElement("BUTTON");
    button.innerHTML = btnName;
    button.id = "sortbysize";
    return button;
  };

  const checkDataLoaded = () => {
    listViewBtn = document.getElementsByClassName("listing-view")[0];
    blockViewBtn = document.getElementsByClassName("block-view")[0];
  };

  const sortBySize = () => {
    listViewBtn.click();
    console.log("List View btn Clicked");
    var sizeBtn = document.getElementsByClassName("size")[0];
    setTimeout(() => {
      sizeBtn.click();
      sizeBtn.click();
    }, 500);
    blockViewBtn.click();
    console.log("Block View btn Clicked");
  };

  let intervalId = setInterval(() => {
    checkDataLoaded();

    if (listViewBtn && blockViewBtn) {
      insertBtn();
    }
  }, 1000);

  const insertBtn = () => {
    clearInterval(intervalId);

    var parentNode = document.getElementsByClassName(
      "fm-breadcrumbs-wrapper"
    )[0];
    var childNode = document.getElementsByClassName("fm-breadcrumbs-block")[0];
    var btn = createBtn("Sort_By_Size");
    parentNode.insertBefore(btn, childNode);

    btn.onclick = sortBySize;
  };
})();