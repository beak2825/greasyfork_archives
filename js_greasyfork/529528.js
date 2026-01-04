// ==UserScript==
// @name     SpaceApp Replace
// @version  1.1
// @grant    none
// @description replace spaceapp buttons
// @match        https://spaceapp.ru/*
// @namespace https://greasyfork.org/users/1443482
// @downloadURL https://update.greasyfork.org/scripts/529528/SpaceApp%20Replace.user.js
// @updateURL https://update.greasyfork.org/scripts/529528/SpaceApp%20Replace.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const checkList = document.querySelector(
    "form#form.form-horizontal fieldset div.col-sm-12:has(#checkListItemsArea)"
  );

  const rows = document.querySelectorAll(
    "form#form.form-horizontal fieldset div.col-sm-12:has(> .btn.btn-primary)"
  );

  if (checkList instanceof HTMLElement) {
    rows.forEach((item) => {
    	if (item instanceof HTMLElement) {
          checkList.appendChild(item);
      }
    })
  }
})();


