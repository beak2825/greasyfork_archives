// ==UserScript==
// @name         Remove blur 333 - Маяк
// @namespace    Маяк
// @version      0.33
// @description  Remove blur 3 - Маяк
// @author       You
// @match        app.mayak.bz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483339/Remove%20blur%20333%20-%20%D0%9C%D0%B0%D1%8F%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/483339/Remove%20blur%20333%20-%20%D0%9C%D0%B0%D1%8F%D0%BA.meta.js
// ==/UserScript==

 // ==/UserScript==

(function() {
'use strict';

// Your code here...
var blurredRows = document.querySelectorAll('tr.blur');
for (var i = 0; i < blurredRows.length; i++) {
blurredRows[i].classList.remove('blur');
}

var tableBody = document.querySelector('tbody.blur');
if (tableBody) {
tableBody.classList.remove('blur');
}
})();