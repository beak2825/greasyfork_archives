

// ==UserScript==
// @name Clien Linkprice Paralyzer
// @version 0.1
// @description Paralyze Clien linkprice
// @author You
// @include https://*.clien.net/*
// @grant none
// @namespace https://greasyfork.org/users/580279
// @downloadURL https://update.greasyfork.org/scripts/404645/Clien%20Linkprice%20Paralyzer.user.js
// @updateURL https://update.greasyfork.org/scripts/404645/Clien%20Linkprice%20Paralyzer.meta.js
// ==/UserScript==

(async function() {
'use strict';

if (document.readyState === 'loading') {
await new Promise(resolve => {
document.addEventListener('DOMContentLoad', () => resolve(), { once: true });
});
}

/**
* Paralyze Linkprice.
*/
for (const element of document.querySelectorAll('.url').values()) {
const namePart = element.nextElementSibling;
const url = element.getAttribute('href');

if (url !== element.textContent) {
element.setAttribute('href', element.textContent);

if (namePart) {
namePart.textContent = 'Paralyzed!';
}
}
}
})();