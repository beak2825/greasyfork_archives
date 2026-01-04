// ==UserScript==
// @name         Update south west airline purchase from
// @namespace    http://tampermonkey.net/
// @version      2024-02-07
// @description  Do the job
// @author       James Conway
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/486827/Update%20south%20west%20airline%20purchase%20from.user.js
// @updateURL https://update.greasyfork.org/scripts/486827/Update%20south%20west%20airline%20purchase%20from.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const purchaseSection = document.getElementsByClassName('purchase-section--subtitle')[0];
  const purchaseSectionRoot = purchaseSection.firstChild;

  const inputArea = document.createElement('textarea');
  inputArea.setAttribute('rows', '4');
  inputArea.setAttribute('cols', '50');
  purchaseSection.insertBefore(inputArea, purchaseSectionRoot);

  const fillButton = document.createElement('button');
  fillButton.textContent = 'Fill the form';
  purchaseSection.insertBefore(fillButton, purchaseSectionRoot);

  fillButton.addEventListener('click', function () {
    const { firstName, middleName, lastName, dob, gender, knownTravelerNumber } = JSON.parse(inputArea.value);

    document.getElementById('passengerFirstName-0').value = firstName;
    document.getElementById('passengerMiddleName-0').value = middleName;
    document.getElementById('passengerLastName-0').value = lastName;
    document.getElementById('passengerDateOfBirth-0').value = dob;
    document.getElementById('passengerGender-0').value = gender;
    document.getElementById('passengerKnownTravelerNumber-0').value = knownTravelerNumber;
  });
})();
