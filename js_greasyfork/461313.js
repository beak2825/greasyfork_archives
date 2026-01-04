// ==UserScript==
// @name         Collapsible Fieldset Areas
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Click legend tag in fieldset to toggle its sibling content visible.
// @author       ChatGPT & Calon
// @match        https://*.253874.net/t/*
// @match        http://*.253874.net/t/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461313/Collapsible%20Fieldset%20Areas.user.js
// @updateURL https://update.greasyfork.org/scripts/461313/Collapsible%20Fieldset%20Areas.meta.js
// ==/UserScript==

(function() {
  'use strict';

// Get all the fieldset Nodes
const fieldsets = document.querySelectorAll('fieldset');

// Loop through all the fieldset Nodes
fieldsets.forEach((fieldset) => {

  // Get the innerHTML of the fieldset Node
  const innerHTML = fieldset.innerHTML;

  // Create a new div element
  const divElement = document.createElement('div');

  // Set the innerHTML of the div element to the innerHTML of the fieldset Node
  divElement.innerHTML = innerHTML;

  // Remove the innerHTML from the fieldset Node
  fieldset.innerHTML = "";

  // Add the div element to the fieldset Node
  fieldset.appendChild(divElement);

  // Move the legend element outside the divElement
  const legendElement = fieldset.querySelector('legend');

  // Check that there is a legend node inside the fieldset
  if (legendElement) {

    // Move the legend node to before the divElement
    fieldset.insertBefore(legendElement, divElement);

    // Check if the parent of the legend node is a div element
    if (legendElement.parentNode.nodeName === 'DIV') {

      // Move the children of the legend node to before the legend node
      while (legendElement.firstChild) {
        fieldset.insertBefore(legendElement.firstChild, legendElement);
      }

      // Remove the div element that wraps the legend node
      fieldset.removeChild(legendElement.parentNode);
    }
  }
});

  for (let i = 0; i < fieldsets.length; i++) {
    const siblings = fieldsets[i].childNodes;
    let legendFound = false;

    for (let j = 0; j < siblings.length; j++) {
      if (siblings[j].nodeName === 'LEGEND') {
        legendFound = true;
      } else if (legendFound && siblings[j].nodeType === 1) {
        siblings[j].style.display = 'none';
      }
    }
  }

  const legends = document.querySelectorAll("fieldset > legend");

  legends.forEach(function(legend) {
    legend.style.cursor = "pointer";
    legend.addEventListener("click", function() {
      const content = legend.parentNode.querySelectorAll(":scope > *:not(legend)");
      content.forEach(function(element) {
        if (element.style.display === "none") {
          element.style.display = "block";
        } else {
          element.style.display = "none";
        }
      });
    });
  });

})();