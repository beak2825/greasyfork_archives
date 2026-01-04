// ==UserScript==
// @name         Torn: speedway
// @namespace    speedway
// @description  1 lap speedways
// @version      0.1.6
// @author       Shlefter
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504176/Torn%3A%20speedway.user.js
// @updateURL https://update.greasyfork.org/scripts/504176/Torn%3A%20speedway.meta.js
// ==/UserScript==

function addButton() {

  const carID = 'youcarid';
  if ($('div.content-title > h4').length > 0 && $('#Speedway').length < 1) {
    const button = `<button id="Speedway" style="color: var(--default-blue-color); cursor: pointer; margin-right: 0">Speedway</button>
                   <span id="SpeedwayResult" style="font-size: 12px; font-weight: 100;"></span>`;
    $('div.content-title > h4').append(button);

    // Attach click event listener directly to the button
    $('#Speedway').on('click', (event) => {
      $('#buyBeerResult').text('');
      // Construct the URL to redirect to
      const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=Speedway&minDrivers=2&maxDrivers=2&trackID=21&laps=1&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

      // Redirect to the constructed URL
      window.location = url;
      console.log('clicked');
    });
  }
}


(function() {
    'use strict';
    addButton();
})();
