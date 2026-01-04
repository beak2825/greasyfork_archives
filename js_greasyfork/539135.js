// ==UserScript==
// @name         EGAFD / BGAFD Better AKA Names and Copy button (with IA Help) v.1.05
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  Reformat the AKA list with an space after each comma and correction for easy copy (IA)
// @author       Janvier57
// @icon         https://external-content.duckduckgo.com/ip3/www.egafd.com.ico
// @match        https://www.egafd.com/actresses/details.php/*
// @match        https://www.bgafd.co.uk/actresses/details.php/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539135/EGAFD%20%20BGAFD%20Better%20AKA%20Names%20and%20Copy%20button%20%28with%20IA%20Help%29%20v105.user.js
// @updateURL https://update.greasyfork.org/scripts/539135/EGAFD%20%20BGAFD%20Better%20AKA%20Names%20and%20Copy%20button%20%28with%20IA%20Help%29%20v105.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('Script started');
  var modelsList = null;
  var timeout = 1000; // 1 second
  var interval = 100; // 100ms

  function waitForElement() {
    modelsList = document.querySelector('tr:has(.acta) ul.list:has(.acta)');
    if (modelsList) {
      console.log('modelsList found');
      runScript();
    } else {
      console.log('modelsList not found, waiting...');
      setTimeout(waitForElement, interval);
      timeout -= interval;
      if (timeout <= 0) {
        console.log('Timeout exceeded, aborting script');
      }
    }
  }

  function runScript() {
    var akaModels = document.querySelectorAll('tr:has(.acta) ul.list:has(.acta) span.acta');
    console.log('akadModels:', akaModels);

    // Add comma + space after each model name
    var modelsText = '';
    akaModels.forEach((model, index) => {
      modelsText += model.textContent.trim();
      if (index < akaModels.length - 1) {
        modelsText += ', ';
      }
    });
    console.log('modelsText:', modelsText);
    modelsList.innerHTML = modelsText;
    console.log('modelsList updated');

    // Add "Copy AKA names" button
    var copyButton = document.createElement('button');
    copyButton.textContent = 'Copy AKA names';
    copyButton.onclick = function() {
      var modelsText = '';
      akaModels.forEach((model, index) => {
        modelsText += model.textContent.trim();
        if (index < akaModels.length - 1) {
          modelsText += ', ';
        }
      });
      console.log('Copy button clicked');
      navigator.clipboard.writeText(modelsText).then(function() {
        alert('Copied');
      });
    };
    modelsList.parentNode.appendChild(copyButton);
    console.log('Copy button added');
  }

  waitForElement();
})();
