// ==UserScript==
// @name            Shopify Password 
// @description     Automatically input password for stage
// @version         0.0.5
// @namespace       http://www.greasyfork.org
// @match *://stage.zymoresearch.com/password
// @downloadURL https://update.greasyfork.org/scripts/461819/Shopify%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/461819/Shopify%20Password.meta.js
// ==/UserScript==


console.log('Running...');

const passwordField = document.getElementById('Password');
const enterButton = document.querySelector('button[type="submit"]');

passwordField.value = 'zymostage2021';
enterButton.click();

console.log('Ran');
