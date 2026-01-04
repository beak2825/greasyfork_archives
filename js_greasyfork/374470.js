// ==UserScript==
// @name     modifica le monde
// @version  1
// @grant    none
// @description Unhides the "paywalled" articles on lemonde.fr
// @include  https://www.lemonde.fr/*.html
// @namespace https://greasyfork.org/users/226548
// @downloadURL https://update.greasyfork.org/scripts/374470/modifica%20le%20monde.user.js
// @updateURL https://update.greasyfork.org/scripts/374470/modifica%20le%20monde.meta.js
// ==/UserScript==


var paywall = document.querySelector(".paywall")
var article = document.querySelector(".article__content")

if(paywall){
	paywall.style.display = "none";
  article.style.height = "auto";
}