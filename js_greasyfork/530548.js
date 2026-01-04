// ==UserScript==
// @name         PORNBOX Better List Models Names and Copy button (with IA Help) v.3.00
// @namespace    http://tampermonkey.net/
// @version      3.00
// @description  Reformat the Models list with an space after each comma and correction for easy copy (IA)
// @author       Janvier57
// @icon         https://external-content.duckduckgo.com/ip3/www.pornbox.com.ico
// @match        https://pornbox.com/application/model/*
// @match        https://www.pornbox.com/application/model/*
// @exclude      https://pornbox.com/application/model/list
// @exclude      https://www.pornbox.com/application/model/list
// @match        https://pornbox.com/*
// @match        https://www.pornbox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530548/PORNBOX%20Better%20List%20Models%20Names%20and%20Copy%20button%20%28with%20IA%20Help%29%20v300.user.js
// @updateURL https://update.greasyfork.org/scripts/530548/PORNBOX%20Better%20List%20Models%20Names%20and%20Copy%20button%20%28with%20IA%20Help%29%20v300.meta.js
// ==/UserScript==

(function() {
      'use strict';
      console.log('Script started');
      var modelsList = null;
      var timeout = 1000; // 1 second
      var interval = 100; // 100ms

      function waitForElement() {
        modelsList = document.querySelector('.model-info__value.model-info__joint-models.more-less--hidden');
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
        var relatedModels = document.querySelectorAll('.model-info__value.model-info__joint-models.more-less--hidden .model-info__tag');
        console.log('relatedModels:', relatedModels);

        // Remove :after pseudo-element
        var stylesheet = document.createElement('style');
        stylesheet.innerHTML = '.model-info__tag:after { content: "" !important; margin-right: 0px !important; }';
        document.head.appendChild(stylesheet);
        console.log('Stylesheet added');

        // Add comma + space after each model name
        var modelsText = '';
        relatedModels.forEach((model, index) => {
          modelsText += model.outerHTML;
          if (index < relatedModels.length - 1) {
            modelsText += ', ';
          }
        });
        console.log('modelsText:', modelsText);
        modelsList.innerHTML = modelsText;
        console.log('modelsList updated');

        // Add "Copy Related Models" button
        var copyButton = document.createElement('button');
        copyButton.textContent = 'Copy Related Models';
        copyButton.onclick = function() {
          var modelsText = '';
          relatedModels.forEach((model, index) => {
            modelsText += model.textContent;
            if (index < relatedModels.length - 1) {
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

        // Add "Copy Related Models with Links" button
        var modelsLinksText = '';
        relatedModels.forEach((model, index) => {
          modelsLinksText += '<a href="' + model.href + '">' + model.textContent + '</a><br>';
        });
        var copyLinksButton = document.createElement('button');
        copyLinksButton.textContent = 'Copy Related Models with Links';
        copyLinksButton.onclick = function() {
          console.log('Copy links button clicked');
          navigator.clipboard.writeText(modelsLinksText).then(function() {
            alert('Copied');
          });
        };
        modelsList.parentNode.appendChild(copyLinksButton);
        console.log('Copy links button added');
      }

      waitForElement();
    })();


    
