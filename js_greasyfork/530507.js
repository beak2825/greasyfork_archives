// ==UserScript==
// @name         XDigma get energy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Get some energy
// @author       valter0ff
// @match        https://xdigma.com/*
// @match        https://xdigma.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530507/XDigma%20get%20energy.user.js
// @updateURL https://update.greasyfork.org/scripts/530507/XDigma%20get%20energy.meta.js
// ==/UserScript==

(function()  {
  "use strict";
  
  $(document).ready(function () {
      const energy = $('div[data-tooltip-content~="Энергия"]');
      const baseUrl = window.location.origin; 

      energy.on('click', function() {
        $.post(`${baseUrl}/1soej2.php`);
      });
  })
})();