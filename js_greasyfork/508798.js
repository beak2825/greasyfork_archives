// ==UserScript==
// @name         Azure Extensions
// @namespace    http://tampermonkey.net/
// @version      2024-09-17
// @description  This repository contains user scripts for enhancing your Azure Portal experience.
// @author       Toni Hoffmann, Dominik Weber
// @match        https://portal.azure.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azure.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508798/Azure%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/508798/Azure%20Extensions.meta.js
// ==/UserScript==

// Initial Author: Dominik Weber
function increaseKeyVaultTextfield() {
  const observer = new MutationObserver(() => {
    const element = document.getElementsByClassName('azc-textarea')[0];
    if (element) {
      element.style.height = '300px';
    }
  });
  observer.observe(document.body, { childList: true });
}

// Initial Author: Toni Hoffmann
function extendAutoExpandNavigationGroupings() {
  const observer = new MutationObserver(() => {
    // Get all groupings
    let groupings = Array.from(document.querySelectorAll('button.azc-listView-collapsible-groupheader'));

    // Filter groupings to only those that contain the relevant SVG child
    let relevantGroupings = groupings.filter((grouping) => {
      let svg = grouping.querySelector('svg');
      return svg && svg.firstChild && svg.firstChild.href.baseVal.includes('#FxSymbol0-034');
    });

    // Print the count of relevant groupings
    console.log(`Found ${relevantGroupings.length} relevant groupings`);

    // Click through each relevant grouping
    relevantGroupings.forEach((grouping) => {
      grouping.click();
    });
  });
  observer.observe(document.body, { childList: true });
}

// Initial Author: Toni Hoffmann
function showSecretsInOverview() {
  const observer = new MutationObserver(() => {
    // check if the page is the keyvault secrets page
    const isKeyVaultPage =
      window.location.href.includes('/providers/Microsoft.KeyVault/vaults/') &&
      window.location.href.endsWith('/secrets');
    if (!isKeyVaultPage) {
      return;
    }
    if (hasButtonAlreadyOnFooter()) {
      return;
    }
    if (!footerHasLoaded()) {
      return; 
    }

    function loadKeyvaultContent(keyvault, secret, callback) {
      const token = JSON.parse(
        sessionStorage.getItem(
          Object.keys(sessionStorage).find((key) => key.includes('https://vault.azure.net/user_impersonation'))
        )
      ).secret;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `https://${keyvault}.vault.azure.net/secrets/${secret}?api-version=7.0`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`); // Set the token as a Bearer token in the Authorization header
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          const content = JSON.parse(xhr.responseText);
          // console.log(content.value);
          callback(content.value);
        }
      };
      xhr.send();
    }

    function showSecrets() {
      // get current url
      const keyVaultName = window.location.href.split('/vaults/')[1].split('/secrets')[0];

      //  Rename the title
      Array.from(
        Array.from(document.querySelectorAll('table.azc-grid-tableHeader tr'))[0].children
      ).pop().firstChild.innerHTML = 'Secret';

      const secretTableRows = Array.from(document.querySelectorAll('table.azc-grid-full tr'));
      // for of
      for (const row of secretTableRows) {
        const secretName = row.children[0].innerText;
        const lastTD = row.children[row.children.length - 1];
        //  lastTD.innerHTML = secretName;
        loadKeyvaultContent(keyVaultName, secretName, function (secret) {
          lastTD.innerHTML = secret;
        });
      }
    }

    // TODO move this to toolbar, but this caused some issues at the moment
    function addButtonToFooter() {
      const footerBar = document.querySelector('.ext-feedback-positioning');
      // add button
      const button = document.createElement('div');
      button.innerHTML = '<div id="custom-show-secret-button" role="button" style="margin-left: 10px; color: var(--colorLink);">Show Secrets</div>';
      button.onclick = function () {
        showSecrets();
      };
      footerBar.appendChild(button);
    }

    function hasButtonAlreadyOnFooter() {
      return document.querySelector('#custom-show-secret-button');
    }

    function footerHasLoaded(){
      return document.querySelector('.ext-feedback-positioning .azc-formElementContainer').innerText.includes('Give feedback');
    }

    addButtonToFooter();
  });
  observer.observe(document.body, { childList: true });
}

(function () {
  'use strict';
  // Choose wich extensions you want to extend:
  extendAutoExpandNavigationGroupings();
  increaseKeyVaultTextfield();
  showSecretsInOverview();
})();
