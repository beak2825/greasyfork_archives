// ==UserScript==
// @name         LookTiny 2023
// @namespace    https://www.facebook.com/jeanpirelag
// @version      3.2
// @description  Compact options to work more comfortably in the Look At Advertisements And Judge Them task (Appen).
// @author       @jeanpirelag
// @match        https*://view.appen.io/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=appen.com
// @downloadURL https://update.greasyfork.org/scripts/405752/LookTiny%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/405752/LookTiny%202023.meta.js
// ==/UserScript==

var titulo = document.querySelector("#remix_cml_container > h1").innerHTML;

if (titulo.includes("Look At Advertisements") || titulo.includes("Observa Los Anuncios") || titulo.includes("Olhe O Anúncio")) {
hideElements();
}

function hideElements() {
var head = document.getElementsByTagName('head')[0];
if (!head) { return; }
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML =` .well {display: none;} .cml-number h4 {display: none;} .cml-number {display: none;} .cml .legend {display: none;} .c-and-a-hide-wrapper {padding: 0;} h5 {display: none;} .empty_box {padding: 15px; border-style: none;} .cml_field .instructions {display: none;} .img-polaroid {-webkit-box-shadow: none; border: none;} .cml .cml_field {margin: 0 0 7px;} `;
head.appendChild(style);
}