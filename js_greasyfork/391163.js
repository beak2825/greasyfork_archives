// ==UserScript==
// @name         	Google Bild austauschen
// @version      	1.3.3.8
// @description ändert das googlebild #useless
// @icon	https://cdn4.iconfinder.com/data/icons/new-google-logo-2015/400/new-google-favicon-512.png
// @include      	*google.*
// @namespace https://greasyfork.org/users/385669
// @downloadURL https://update.greasyfork.org/scripts/391163/Google%20Bild%20austauschen.user.js
// @updateURL https://update.greasyfork.org/scripts/391163/Google%20Bild%20austauschen.meta.js
// ==/UserScript==


var mydiv = document.getElementById("lga");
mydiv.innerHTML = "<style>#lga{height:233px;margin-top:89px}</style>";

var image = document.createElement("img");
image.setAttribute("src", "https://i.imgur.com/3G1raVe.png");
image.setAttribute("id", "hplogo");
image.setAttribute("width", "400");
image.setAttribute("height", "220");
image.setAttribute("padding-top", "109px");
mydiv.appendChild(image);