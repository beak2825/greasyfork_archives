// ==UserScript==
// @name        Paypal skip homepage
// @namespace   paypal_jump_to_login
// @description Skips the home page and goes straight to the login page
// @include     https://www.paypal.com/*/home
// @version     0.2
// @grant       none
// @icon        https://www.paypal.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/372328/Paypal%20skip%20homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/372328/Paypal%20skip%20homepage.meta.js
// ==/UserScript==

document.location = 'https://www.paypal.com/signin?country.x=US&locale.x=en_US';
