// ==UserScript==
// @name         Geni Swap Street Number
// @namespace    4525639+rautava@users.noreply.github.com
// @version      1.3
// @description  Swap the street and number in the address fields.
// @author       Tommi Rautava
// @license      CC0-1.0
// @match        https://www.geni.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geni.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529006/Geni%20Swap%20Street%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/529006/Geni%20Swap%20Street%20Number.meta.js
// ==/UserScript==

let elementIds = [
  "baptism_location_street_address1",
  "birth_location_street_address1",
  "burial_location_street_address1",
  "current_residence_street_address1",
  "death_location_street_address1",
  "location_street_address1",
];

let regex = /^(\d+)\s+(.+)\s*$/;

const { get, set } = Object.getOwnPropertyDescriptor(
  HTMLInputElement.prototype,
  "value"
);

(function () {
  "use strict";

  elementIds.forEach(function (element) {
    let input = document.querySelector('input[id="' + element + '"]');

    if (input) {
      Object.defineProperty(input, "value", {
        get() {
          return get.call(this);
        },
        set(newValue) {
          let result = newValue.match(regex);

          if (result) {
            newValue = result[2] + " " + result[1];
          }

          return set.call(this, newValue);
        },
      });
    }
  });
})();
