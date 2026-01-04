// ==UserScript==
// @name         Map Sizes
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  More map sizes are available.
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424658/Map%20Sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/424658/Map%20Sizes.meta.js
// ==/UserScript==

(function() {

var thiccnessbutton = document.createElement("button");
thiccnessbutton.innerHTML = "Add Map Sizes";
document.body.appendChild(thiccnessbutton);
thiccnessbutton.id = 'thiccnessbutton';
thiccnessbutton.style.position = "fixed";
thiccnessbutton.style.top = 310;
thiccnessbutton.style.left = 10;

document.getElementById('thiccnessbutton').onclick = function(){

let sizeselector = document.getElementsByClassName('mapeditor_row_select')[0];
    sizeselector.id = 'sizeselector';

let size100 = document.createElement('option');
    size100.id = 'size100';
    size100.text = '100';
    size100.value = 2;

    sizeselector.appendChild (size100);


let sizethicc = document.createElement('option');
    sizethicc.id = 'sizethicc';
    sizethicc.text = '0.1';
    sizethicc.value = 200;

    sizeselector.appendChild (sizethicc);


alert('Map sizes have been added');

}
})();


