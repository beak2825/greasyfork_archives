// ==UserScript==
// @name Auto Send Att Unit Settings
// @version 1.5
// @description Set the desired arrival time and the script will automatically send the attack. Added unit settings modal.
// @include https://*/game.php?*&screen=place&try=confirm
// @namespace https://greasyfork.org/users/1388899
// @downloadURL https://update.greasyfork.org/scripts/520016/Auto%20Send%20Att%20Unit%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/520016/Auto%20Send%20Att%20Unit%20Settings.meta.js
// ==/UserScript==

// Function to get the current page identifier based on the village ID from the URL
function getPageIdentifier() {
  const urlParams = new URLSearchParams(window.location.search);
  const villageId = urlParams.get('village'); // Get the village ID from the URL
  return villageId ? `village_${villageId}` : 'unknown'; // Use 'village_' prefix to differentiate
}

// Create a button to open the settings modal
const button = document.createElement('button');
button.id = 'openSettings';
button.innerHTML = 'Set Units';
button.style.position = 'fixed';
button.style.bottom = '20px';
button.style.left = '20px';
button.style.padding = '10px 20px';
button.style.backgroundColor = '#4CAF50';
button.style.color = 'white';
button.style.border = 'none';
button.style.cursor = 'pointer';
document.body.appendChild(button);

// Create the settings modal
const modal = document.createElement('div');
modal.id = 'settingsModal';
modal.style.display = 'none';
modal.style.position = 'fixed';
modal.style.top = '50%';
modal.style.left = '50%';
modal.style.transform = 'translate(-50%, -50%)';
modal.style.backgroundColor = 'white';
modal.style.border = '1px solid #ccc';
modal.style.padding = '20px';
modal.style.boxShadow = '0px 4px 8px rgba(0,0,0,0.2)';
modal.style.zIndex = '1000';
modal.innerHTML = `
  <h3>Set Unit Quantities</h3>
  <label for="spear">Spear:</label><input type="number" id="spear" value="0"><br>
  <label for="sword">Sword:</label><input type="number" id="sword" value="0"><br>
  <label for="axe">Axe:</label><input type="number" id="axe" value="0"><br>
  <label for="spy">Spy:</label><input type="number" id="spy" value="0"><br>
  <label for="light">Light:</label><input type="number" id="light" value="0"><br>
  <label for="heavy">Heavy:</label><input type="number" id="heavy" value="0"><br>
  <label for="ram">Ram:</label><input type="number" id="ram" value="0"><br>
  <label for="catapult">Catapult:</label><input type="number" id="catapult" value="0"><br>
  <label for="knight">Knight:</label><input type="number" id="knight" value="0"><br>
  <label for="snob">Snob:</label><input type="number" id="snob" value="0"><br>
  <label for="numAttack">Num attack:</label><input type="number" id="numAttack" value="0"><br>
  <button id="applySettings" style="margin-top: 20px;">Apply</button>
  <button id="saveSettings" style="margin-top: 20px; background-color: #007bff;">Save</button>
  <button id="closeModal" style="margin-top: 20px; background-color: red;">Close</button>
`;
document.body.appendChild(modal);

// Open the modal when the settings button is clicked
document.getElementById('openSettings').addEventListener('click', function() {
  const pageIdentifier = getPageIdentifier(); // Get the current page's identifier (based on village ID)

  // Load values from localStorage specific to the page
  const savedUnits = JSON.parse(localStorage.getItem(`units_${pageIdentifier}`)) || {};

  // Populate the inputs with saved values
  document.getElementById('spear').value = savedUnits.spear || 0;
  document.getElementById('sword').value = savedUnits.sword || 0;
  document.getElementById('axe').value = savedUnits.axe || 0;
  document.getElementById('spy').value = savedUnits.spy || 0;
  document.getElementById('light').value = savedUnits.light || 0;
  document.getElementById('heavy').value = savedUnits.heavy || 0;
  document.getElementById('ram').value = savedUnits.ram || 0;
  document.getElementById('catapult').value = savedUnits.catapult || 0;
  document.getElementById('knight').value = savedUnits.knight || 0;
  document.getElementById('snob').value = savedUnits.snob || 0;
  document.getElementById('numAttack').value = savedUnits.numAttack || 0;

  document.getElementById('settingsModal').style.display = 'block';
});

// Close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', function() {
  document.getElementById('settingsModal').style.display = 'none';
});

// Apply the unit values to the input fields and click the button multiple times when the "Apply" button is clicked
document.getElementById('applySettings').addEventListener('click', function() {
  // Get the values from the modal inputs
  const spear = document.getElementById('spear').value;
  const sword = document.getElementById('sword').value;
  const axe = document.getElementById('axe').value;
  const spy = document.getElementById('spy').value;
  const light = document.getElementById('light').value;
  const heavy = document.getElementById('heavy').value;
  const ram = document.getElementById('ram').value;
  const catapult = document.getElementById('catapult').value;
  const knight = document.getElementById('knight').value;
  const snob = document.getElementById('snob').value;
  const numAttack = parseInt(document.getElementById('numAttack').value);  // Get the number of attacks

  // Save the values to localStorage using the current page identifier as a key
  const units = {
    spear,
    sword,
    axe,
    spy,
    light,
    heavy,
    ram,
    catapult,
    knight,
    snob,
    numAttack
  };

  const pageIdentifier = getPageIdentifier(); // Get the current page's identifier (based on village ID)
  localStorage.setItem(`units_${pageIdentifier}`, JSON.stringify(units)); // Use page-specific key

  const element = document.getElementById('troop_confirm_train');
  if (numAttack > 0) { // Only proceed if numAttack is greater than 0
    for (let i = 0; i < numAttack; i++) {
      setTimeout(() => {
        if (element) {
          element.click(); // Simulate the click
        }
      }, 200 * i); // Delay of 200ms between clicks
    }
  } else {
    console.log('numAttack is set to 0, no clicks will be performed.');
  }

  // Update the corresponding input values on the page after clicking
  setTimeout(() => {
    const inputs = document.querySelectorAll('.units-row input[data-unit]');
    inputs.forEach(input => {
      const unitType = input.dataset.unit;
      // Set value for each unit according to the modal input value
      if (unitType === 'spear') {
        input.value = spear;
      } else if (unitType === 'sword') {
        input.value = sword;
      } else if (unitType === 'axe') {
        input.value = axe;
      } else if (unitType === 'spy') {
        input.value = spy;
      } else if (unitType === 'light') {
        input.value = light;
      } else if (unitType === 'heavy') {
        input.value = heavy;
      } else if (unitType === 'ram') {
        input.value = ram;
      } else if (unitType === 'catapult') {
        input.value = catapult;
      } else if (unitType === 'knight') {
        input.value = knight;
      } else if (unitType === 'snob') {
        input.value = snob;
      }
    });

    // Close the modal after applying the settings
    document.getElementById('settingsModal').style.display = 'none';

    // Delay of 200ms before enabling the submit button
    setTimeout(() => {
      // Get the input element with the ID 'troop_confirm_submit'
      const submitButton = document.getElementById('troop_confirm_submit');

      // Remove the 'disabled' attribute to enable the button
      if (submitButton) {
        submitButton.removeAttribute('disabled');
      }
    }, 200);
  }, 200 * numAttack); // Ensure values are updated after the last click
});

// Save the unit values to localStorage without applying or clicking the button, specific to the page
document.getElementById('saveSettings').addEventListener('click', function() {
  // Get the values from the modal inputs
  const spear = document.getElementById('spear').value;
  const sword = document.getElementById('sword').value;
  const axe = document.getElementById('axe').value;
  const spy = document.getElementById('spy').value;
  const light = document.getElementById('light').value;
  const heavy = document.getElementById('heavy').value;
  const ram = document.getElementById('ram').value;
  const catapult = document.getElementById('catapult').value;
  const knight = document.getElementById('knight').value;
  const snob = document.getElementById('snob').value;
  const numAttack = parseInt(document.getElementById('numAttack').value);  // Get the number of attacks

  // Save the values to localStorage using the current page identifier as a key
  const units = {
    spear,
    sword,
    axe,
    spy,
    light,
    heavy,
    ram,
    catapult,
    knight,
    snob,
    numAttack
  };

  const pageIdentifier = getPageIdentifier(); // Get the current page's identifier (based on village ID)
  localStorage.setItem(`units_${pageIdentifier}`, JSON.stringify(units)); // Use page-specific key
});
