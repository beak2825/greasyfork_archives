// ==UserScript==
// @name         Add to Cookidoo (Bypass Country Restrictions)
// @namespace    http://your-namespace-here
// @version      1.0
// @description  Bypass "Add to cookidoo" button geography restrictions
// @author       momo
// @match        *://www.recipecommunity.com.au/*
// @match        *://www.rezeptwelt.de/*
// @match        *://www.mundodereceitasbimby.com.pt/*
// @match        *://www.espace-recettes.fr/*
// @match        *://www.recetario.es/*
// @match        *://www.svetreceptu.cz/*
// @match        *://www.ricettario-bimby.it/*
// @match        *://www.przepisownia.pl/*
// @license     Mozilla Public License 2.0
// @downloadURL https://update.greasyfork.org/scripts/481216/Add%20to%20Cookidoo%20%28Bypass%20Country%20Restrictions%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481216/Add%20to%20Cookidoo%20%28Bypass%20Country%20Restrictions%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

      // modify if you're in another country and want to use your version of cookidoo:
      const myCookidooURL = 'cookidoo.thermomix.com'
      const myCountryCode = 'en-US'
      const myCookidooCountry = 'US'

      const domainMappings = {
          'www.recipecommunity.com.au': {
              cookidooLink: 'cookidoo.com.au',
              countryCode: 'en-AU',
          },
          'www.rezeptwelt.de': {
              cookidooLink: 'cookidoo.de',
              countryCode: 'de-DE',
          },
          'www.mundodereceitasbimby.com.pt': {
              cookidooLink: 'cookidoo.pt',
              countryCode: 'pt-PT',
          },
          'www.espace-recettes.fr': {
              cookidooLink: 'cookidoo.fr',
              countryCode: 'fr-FR',
          },
          'www.recetario.es': {
              cookidooLink: 'cookidoo.es',
              countryCode: 'es-ES',
          },
          'www.svetreceptu.cz': {
              cookidooLink: 'cookidoo.cz',
              countryCode: 'cz-CZ',
          },
          'www.ricettario-bimby.it': {
              cookidooLink: 'cookidoo.it',
              countryCode: 'it-IT',
          },
          'www.przepisownia.pl': {
              cookidooLink: 'cookidoo.pl',
              countryCode: 'pl-PL',
          }
      };

    // Wait for the page to fully load
    window.addEventListener('load', function () {
        const currentDomain = window.location.hostname;

        GM_log(currentDomain);

        // Select the host element containing the shadow root
        const hostElement = document.querySelector(`add-to-cookidoo[market="${domainMappings[currentDomain].cookidooLink}"]`);

        if (hostElement) {
            // Access the shadow root
            const shadowRoot = hostElement.shadowRoot;

            if (shadowRoot) {
                // Use querySelector to select the green button within the shadow DOM
                const button = shadowRoot.querySelector('a.theme-green.type-single-line.font-size-default.padding-default.corner-square.text-container');

                if (button) {
                    // Get the modified href from the green button within the Shadow DOM
                    let modifiedHref = button.getAttribute('href');

                    // Replace the domain and change 'en-AU' to 'en-US' in the modifiedHref
                    modifiedHref = modifiedHref.replace(domainMappings[currentDomain].cookidooLink, myCookidooURL);
                    modifiedHref = modifiedHref.replace(domainMappings[currentDomain].countryCode, myCountryCode);

                    // Create the "Add to Cookidoo US" button element
                    const addButton = document.createElement('a');
                    addButton.setAttribute('href', modifiedHref);
                    addButton.setAttribute('target', '_blank');
                    addButton.style.position = 'fixed';
                    addButton.style.bottom = '20px';
                    addButton.style.left = '20px';
                    addButton.style.backgroundColor = 'green'; // You can change the button's color
                    addButton.style.color = 'white';
                    addButton.style.padding = '10px 20px';
                    addButton.style.borderRadius = '5px';
                    addButton.style.fontSize = '25px';
                    addButton.style.zIndex = '9999';
                    addButton.textContent = 'Add to Cookidoo ' + myCookidooCountry;

                    // Append the "Add to Cookidoo US" button to the document body
                    document.body.appendChild(addButton);
                }
            }
        }
    });
})();
