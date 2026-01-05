// ==UserScript==
// @name         PTH Searchbars open in new tab
// @version      0.2
// @description  Open the searches from the search bar on a new tab
// @author       Chameleon
// @include      http*://redacted.ch/*
// @grant        none
// @namespace https://greasyfork.org/users/87476
// @downloadURL https://update.greasyfork.org/scripts/25843/PTH%20Searchbars%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/25843/PTH%20Searchbars%20open%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var forms=document.getElementById('searchbars').getElementsByTagName('form');
  for(var i=0; i<forms.length; i++)
  {
    forms[i].setAttribute('target', '_blank');
  }
})();
