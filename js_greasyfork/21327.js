// ==UserScript==
// @name        remove pokemon
// @namespace   remove pokemon
// @include     https://*, http://*
// @version     1.1
// @description:en Remove pokemons from the whole internet
// @grant       none
// @description Remove pokemons from the whole internet
// @downloadURL https://update.greasyfork.org/scripts/21327/remove%20pokemon.user.js
// @updateURL https://update.greasyfork.org/scripts/21327/remove%20pokemon.meta.js
// ==/UserScript==

if (document.body.innerHTML.contains("pokemon") != "0") {alert("Fuck off from here")}
var el = document.body;
function warn() {
if (document.body.innerHTML.contains("pokemon") != "0") {alert("Fuck off from here")}}
el.addEventListener("DOMSubtreeModified", warn, false)