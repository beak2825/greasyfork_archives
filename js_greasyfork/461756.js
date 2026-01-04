// "use strict";
// ==UserScript==
// @name         Wanikani Anti Woke Mode
// @namespace    antiwokeness
// @version      0.1.1
// @description  WK without the W standing for Woke
// @author       Oian
// @copyright
// @include     
// @match
// @license      
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/461756/Wanikani%20Anti%20Woke%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/461756/Wanikani%20Anti%20Woke%20Mode.meta.js
// ==/UserScript==

// The token has to be included with every request, and should be delivered in a HTTP header that looks like:
// Authorization: Bearer 88fff13e-7b85-4138-8b92-b58cd2907de2

var apiToken = '88fff13e-7b85-4138-8b92-b58cd2907de2';
var apiEndpointPath = 'assignments';
var requestHeaders =
  new Headers({
    Authorization: 'Bearer ' + apiToken,
  });
var apiEndpoint =
  new Request('https://api.wanikani.com/v2/' + apiEndpointPath, {
    method: 'GET',
    headers: requestHeaders
  });

console.log("nigger")

fetch(apiEndpoint)
  .then(response => response.json())
  .then(responseBody => console.log(responseBody));