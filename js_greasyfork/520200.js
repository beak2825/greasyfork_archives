// ==UserScript== 
// @name         Torn: Speedway and Dock Quick Race
// @namespace    speedway
// @description  Speedway, Mudpit, and Docks
// @version      0.6.3
// @author       Shlefter modified by yoyoYossarian
// @match        https://www.torn.com/loader.php?sid=racing*
// @match        https://www.torn.com/page.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520200/Torn%3A%20Speedway%20and%20Dock%20Quick%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/520200/Torn%3A%20Speedway%20and%20Dock%20Quick%20Race.meta.js
// ==/UserScript==

function addButtons() {
  const speedwayCarID = '845962';
  const mudpitCarID = '783665';
  const docksCarID = '871457';

  if ($('div.content-title > h4').length > 0 && $('#Speedway').length < 1) {
    // Create buttons for Speedway, Mudpit, and Docks
    const buttons = `
      <button id="Speedway" style="color: var(--default-blue-color); cursor: pointer; margin-right: 10px">Speedway</button>
      <button id="Docks" style="color: var(--default-orange-color); cursor: pointer; margin-right: 0">Docks</button>
      <span id="RaceResult" style="font-size: 12px; font-weight: 100;"></span>
    `;
    $('div.content-title > h4').append(buttons);

    // Attach click event listener for Speedway button
    $('#Speedway').on('click', () => {
      const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${speedwayCarID}&createRace=true&title=LongSpeedway&minDrivers=2&maxDrivers=2&trackID=21&laps=100&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now() / 1000)}&rfcv=${getRFC()}`;
      window.location = url;
      console.log('Speedway clicked');
    });


    // Attach click event listener for Docks button
    $('#Docks').on('click', () => {
      const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${docksCarID}&createRace=true&title=Docks&minDrivers=2&maxDrivers=2&trackID=10&laps=100&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now() / 1000)}&rfcv=${getRFC()}`;
      window.location = url;
      console.log('Docks clicked');
    });
  }
}



(function() {
  'use strict';
  addButtons();
})();
