// ==UserScript==
// @name        Auto-check all checkboxes in fastgood.cheap
// @namespace   Auto-check
// @version     1.0
// @description Automatically check all checkboxes in the website fastgood.cheap without the 'elite hacker' easter egg showing up
// @match       https://fastgood.cheap
// @author      Pump3d
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/423970/Auto-check%20all%20checkboxes%20in%20fastgoodcheap.user.js
// @updateURL https://update.greasyfork.org/scripts/423970/Auto-check%20all%20checkboxes%20in%20fastgoodcheap.meta.js
// ==/UserScript==

let elem = document.getElementsByClassName('such-an-elite-hacker');

if (elem[0]) {
    elem[0].remove();
}

[].forEach.call(document.querySelectorAll('input[type="checkbox"]'), function (checkbox) {
    checkbox.checked = true;
});