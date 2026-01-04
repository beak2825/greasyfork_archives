// ==UserScript==
// @name         BH Omins - Quick Add Buttons
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Click buttons to search for Omins Items
// @author       BingGPT & WillH
// @match        https://omins.snipesoft.net.nz/ominst/modules/omins/invoices_addedit.php?tableid=1041*
// @match        https://omins.snipesoft.net.nz/ominst/search.php?id=1047*
// @match        https://omins.snipesoft.net.nz/search.php?id=1047*
// @match        https://omins.snipesoft.net.nz/modules/omins/invoices_addedit.php?tableid=1041*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=net.nz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488490/BH%20Omins%20-%20Quick%20Add%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/488490/BH%20Omins%20-%20Quick%20Add%20Buttons.meta.js
// ==/UserScript==

jQuery(document).ready(function() {
  'use strict';

  // Function to create a button
  function createButton(text, outputText) {
    var button = document.createElement("button");
    button.innerHTML = text;
    button.style.whiteSpace = "nowrap";
    button.style.padding = "2px";
    button.style.margin = "1px";

    button.addEventListener("click", function (event) {
      // Prevent the form from being submitted
      event.preventDefault();

      var outputField;
      if (window.location.href.includes("invoices_addedit.php")) {
        outputField = document.getElementById("ds-partnumber");
      } else if (window.location.href.includes("search.php")) {
        outputField = document.querySelector("#startswith");
      }

      if (outputField) {
        // If outputText is an empty string, clear the input field
        if (outputText === "") {
          outputField.value = "";
        } else {
          // Otherwise, append the output text to the current value of the input field
          outputField.value += outputText;

          // Simulate a key press event
          var keyboardEvent = new KeyboardEvent("keydown", { key: "a" });
          outputField.dispatchEvent(keyboardEvent);

          // Trigger the autocomplete dropdown
          jQuery(outputField).autocomplete("search", outputField.value);
        }
      }
    });
    return button;
  }

  // Function to create a single group with label and buttons
  function createGroup(labelText, buttonTexts, outputTexts) {
    var groupDiv = document.createElement("div");
    groupDiv.style.display = "flex";
    groupDiv.style.flexDirection = "column";
    groupDiv.style.alignItems = "flex-start";
    groupDiv.style.marginRight = "20px";

    var label = document.createElement("p");
    label.innerHTML = labelText;
    groupDiv.appendChild(label);

    var buttonDiv = document.createElement("div");
    buttonDiv.style.display = "flex";
    buttonDiv.style.flexDirection = "row";
    buttonDiv.style.flexWrap = "wrap"; // Wrap buttons to avoid overflow

    buttonTexts.forEach(function (text, index) {
      var button = createButton(text, outputTexts[index]);
      buttonDiv.appendChild(button);
    });

    groupDiv.appendChild(buttonDiv);
    return groupDiv;
  }

  // Create label and button groups
  var sizeGroup = createGroup("Size:", ["2.5m", "3m", "4.5m", "6m", "4m", "8m"], ["2.5%", "3m%", "4.5%", "6%", "4m%", "8%"]);
  var itemGroup = createGroup("Item:", ["Frame", "Solid Wall", "Door Wall", "Window Wall", "Mesh Wall", "Canopy", "Pegs"], ["frame%", "hzwall ss%", "hzwall ds%", "hzwall ws%", "hzwall mesh%", "hztop%", "Pegs"]);
  var colourGroup = createGroup("Colour:", ["Black", "White", "Grey", "Deep Ocean Blue", "Stone"], ["Black", "White", "Grey", "Deep Ocean Blue", "Stone"]);
  var clearGroup = createGroup("Clear:", ["Clear"], [""]);

  // Create a container div to hold all groups
  var containerDiv = document.createElement("div");
  containerDiv.style.display = "flex";
  containerDiv.style.justifyContent = "flex-start";
  containerDiv.style.marginBottom = "10px";

  // Append groups to the container
  containerDiv.appendChild(sizeGroup);
  containerDiv.appendChild(itemGroup);
  containerDiv.appendChild(colourGroup);
  containerDiv.appendChild(clearGroup);

  // Append container div to the page
  var header;
  if (window.location.href.includes("invoices_addedit.php")) {
    header = document.getElementById("LITable");
  } else if (window.location.href.includes("search.php")) {
    header = document.querySelector("#basicSearchTab > table");
  }
  if (header) {
    header.parentNode.insertBefore(containerDiv, header);
  }

document.addEventListener('keypress', function(event) {
  if (event.key === 'Enter' && window.location.href.includes("search.php")) {
    document.getElementById('searchbutton').click(); // Click the search button
  }
});


////// START ////// MAKE customer PO INTO A BUTTON
// Select the label element
const poNumberLabel = document.querySelector('label[for="ponumber"]');

// Get the label text content
const poNumberText = poNumberLabel.textContent;

// Create a button element
const poNumberButton = document.createElement('button');
poNumberButton.textContent = poNumberText; // Set button text
poNumberButton.classList.add('Buttons', 'button');

// Add click event listener (same as before)
poNumberButton.addEventListener('click', () => {
  const linkUrl = generateLinkUrl();
  window.open(linkUrl, '_blank');
});

// Replace the label with the button (**consider accessibility implications**)
poNumberLabel.parentNode.replaceChild(poNumberButton, poNumberLabel);

// Function to generate the link URL (unchanged)
function generateLinkUrl() {
  const poNumber = document.querySelector('input[name="ponumber"]').value;
  return `https://omins.snipesoft.net.nz/ominst/modules/omins/purchase_addedit.php?tableid=1052&id=${poNumber}`;
}
////// END ////// MAKE customer PO INTO A BUTTON



});
