// ==UserScript==
// @name         Tidal Country Switcher
// @namespace    https://greasyfork.org/en/scripts/36130-tidal-country-switcher
// @version      1.1
// @description  Press Ctrl+Shift+S to switch which country you browse Tidal's streaming site from.
// @author       newstarshipsmell
// @match        https://listen.tidal.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/36130/Tidal%20Country%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/36130/Tidal%20Country%20Switcher.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.addEventListener('keydown', function(e) {
    if ((e.keyCode == 83 || e.keyCode == 115) && e.shiftKey && e.ctrlKey && !e.altKey) {
      var activeSession = JSON.parse(localStorage.getItem('_TIDAL_activeSession2'));
      var country = activeSession.countryCode;
      var newCountry = prompt('Enter new country code and click OK. Cancel to abort.\n\nEnter "where" for the current list of countries Tidal is available in.\n\nEnter "codes" for a list of ISO 3166-1 alpha-2 codes.\n\nEnter "store" to open the country-specific store page for the current country.',country);
      if (newCountry === null)
        return;
      var validCountries = /^(ad|ar|at|au|be|br|ca|ch|cl|co|cy|cz|de|dk|do|ee|es|fi|fr|gb|gr|hk|hu|ie|il|is|it|jm|jp|kr|li|lt|lu|lv|mc|mt|mx|my|nl|no|nz|pe|pl|pr|pt|ro|se|sg|si|sk|th|tr|us|za)$/i;
      if (validCountries.test(newCountry.toLowerCase()) && newCountry.toLowerCase() != country.toLowerCase()) {
        activeSession.countryCode = newCountry.toUpperCase();
        localStorage.setItem('_TIDAL_activeSession2', JSON.stringify(activeSession));
        location.reload();
      } else if (newCountry == 'codes') {
        GM_openInTab('https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements', false);
      } else if (newCountry == 'store') {
        GM_openInTab('http://tidal.com/' + country.toLowerCase() + '/store' + window.location.pathname, false);
      } else if (newCountry == 'where') {
        GM_openInTab('https://support.tidal.com/hc/en-us/articles/202453191-Which-countries-is-TIDAL-available-', false);
      }
    }
  }, false);
})();