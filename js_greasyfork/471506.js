// ==UserScript==
// @name         Update Maxlength
// @namespace    update mmaxlength
// @description updates maxlenghth to infinite
// @version      1.1
// @match         http://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471506/Update%20Maxlength.user.js
// @updateURL https://update.greasyfork.org/scripts/471506/Update%20Maxlength.meta.js
// ==/UserScript==
(function() {
  'use strict';
  
  // Get all input fields on the page
  var inputFields = document.querySelectorAll('input');
  
  // Loop through each input field and update the maxlength attribute
  inputFields.forEach(function(inputField) {
    inputField.setAttribute('maxlength', '99999999');
  });
})();