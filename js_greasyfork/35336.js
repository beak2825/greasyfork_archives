// ==UserScript==
// @name        BPI iBank Checkbox
// @namespace   elsereturn
// @include     https://ib*.bpi.ir/*
// @version     1
// @grant       none
// @description BPI iBank Checkbox Enabled
// @description:en BPI iBank Checkbox Enabled
// @downloadURL https://update.greasyfork.org/scripts/35336/BPI%20iBank%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/35336/BPI%20iBank%20Checkbox.meta.js
// ==/UserScript==

// maybe the elements are already on the page
checkThem([].slice.call(document.querySelectorAll('input[type="checkbox"]')));

// but anyway set a MutationObserver handler for them
setMutationHandler(document, 'input[type="checkbox"]', checkThem);

function checkThem(nodes) {
    nodes.forEach(function(n) { n.checked = true });
}