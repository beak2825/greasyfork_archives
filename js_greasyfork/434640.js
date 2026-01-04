// ==UserScript==
// @name         Makeshift Blue Light Filter
// @version      1
// @description  Blue light filter for Camas :)
// @author       Chase Davis
// @match        https://learning.k12.com/*
// @match        https://login-learn.k12.com/*
// @icon         https://www.google.com/s2/favicons?domain=k12.com
// @grant        none
// @namespace https://greasyfork.org/users/815497
// @downloadURL https://update.greasyfork.org/scripts/434640/Makeshift%20Blue%20Light%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/434640/Makeshift%20Blue%20Light%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

let opacity = 10; // 10% opacity
let color = '#d66f00'; // Orange-ish red color

document.body.innerHTML += `
<div id="filter" style="pointer-events: none; position: fixed; width: 100%; height: 100%; background-color: `+color+` !important; opacity: `+opacity/100+`; top: 0; z-index: 999;"></div>
`;

})();