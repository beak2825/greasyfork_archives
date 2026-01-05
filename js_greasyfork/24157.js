// ==UserScript==
// @name Mozanapló felhasználónév és jelszó megjegyzése
// @description Mozanapló felhasznlónév és jelszó megjegyzése a Kölcsey Ferenc Általános Iskolában
// @version 1.0
// @namespace kolcsey21.mozanaplo.hu
// @match http://kolcsey21.mozanaplo.hu
// @match https://kolcsey21.mozanaplo.hu
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24157/Mozanapl%C3%B3%20felhaszn%C3%A1l%C3%B3n%C3%A9v%20%C3%A9s%20jelsz%C3%B3%20megjegyz%C3%A9se.user.js
// @updateURL https://update.greasyfork.org/scripts/24157/Mozanapl%C3%B3%20felhaszn%C3%A1l%C3%B3n%C3%A9v%20%C3%A9s%20jelsz%C3%B3%20megjegyz%C3%A9se.meta.js
// ==/UserScript==

$("#loginform > input[type='text']:first").remove ();