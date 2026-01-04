// ==UserScript==
// @name         Hide Ovh from Delta Agar.io
// @namespace    Delta Agar.io
// @version      0.1
// @description  Remove Ovh bot overlayment from Delta Agario
// @author       New Jack 🕹️
// @match        *://agar.io/*
// @icon         https://i.imgur.com/wnEFdAR.jpeg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468526/Hide%20Ovh%20from%20Delta%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/468526/Hide%20Ovh%20from%20Delta%20Agario.meta.js
// ==/UserScript==

window.setTimeout(function() {
  // Create a new button element
  const toggleButton = document.createElement("button");
  toggleButton.id = "toggle-muzza-gui";
  toggleButton.textContent = "🕹️ Toggle Ovh Elements";
  toggleButton.style.marginTop = "10px"; // Optional: Add some margin to the button

  // Append the button to the container with the class "fcols grow hinherit"
  const container = document.querySelector(".fcols.grow.hinherit");
  if (container) {
    container.appendChild(toggleButton);
  } else {
    console.error("Container element not found");
  }

  // Add a click event listener to the button
  toggleButton.addEventListener("click", function() {
    const muzzaGuiElements = document.getElementsByClassName("muzza-gui");

    for (let i = 0; i < muzzaGuiElements.length; i++) {
      if (muzzaGuiElements[i].style.display === "none") {
        muzzaGuiElements[i].style.display = "block";
      } else {
        muzzaGuiElements[i].style.display = "none";
      }
    }
  });
}, 5000); // delay in milliseconds