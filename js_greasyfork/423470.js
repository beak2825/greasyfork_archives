// ==UserScript==
// @name         ptpimg.me show api key
// @version      0.1
// @description  Show the API key on the ptpimg.me home page
// @author       Chameleon
// @include      http*://ptpimg.me/index.php
// @grant        none
// @namespace https://greasyfork.org/users/280865
// @downloadURL https://update.greasyfork.org/scripts/423470/ptpimgme%20show%20api%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/423470/ptpimgme%20show%20api%20key.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var s=document.createElement('span');
  document.body.appendChild(s);
  s.setAttribute('style', 'text-align: center; width: 100%; display: inline-block;');
  s.innerHTML = 'API Key: '+document.getElementById('api_key').value;
})();