// ==UserScript==
// @name            ZR-Stage Password 
// @description     Automatically input password for ZR Stage
// @version         0.0.1
// @namespace       http://www.greasyfork.org
// @match https://zr-stage-com.myshopify.com/password
// @downloadURL https://update.greasyfork.org/scripts/471955/ZR-Stage%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/471955/ZR-Stage%20Password.meta.js
// ==/UserScript==


console.log('Running...');

const passwordField = document.getElementById('Password');
const enterButton = document.querySelector('button[type="submit"]');

passwordField.value = 'zymostage2019';
enterButton.click();

console.log('Ran');
