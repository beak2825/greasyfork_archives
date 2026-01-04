// ==UserScript==
// @name         Is this on TurkPrime
// @namespace    https://github.com/Kadauchi
// @version      1.0.0
// @description  Lets you know if a HIT is on the turkprime.com domain.
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://*.turkprime.com/*
// @downloadURL https://update.greasyfork.org/scripts/390219/Is%20this%20on%20TurkPrime.user.js
// @updateURL https://update.greasyfork.org/scripts/390219/Is%20this%20on%20TurkPrime.meta.js
// ==/UserScript==

const header = document.createElement('div');
header.style.backgroundColor = 'red';
header.style.textAlign = 'center';
document.body.prepend(header);

const label = document.createElement('label');
label.style.color = 'black';
label.textContent = 'This is hosted on TurkPrime.';
header.appendChild(label);
