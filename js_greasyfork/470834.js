// ==UserScript==
// @name     DOESN'T WORK Meshcentral Prevent Filter Autocomplete
// @description Used to prevent autofilling the filter field in Meshcentral
// @match    https://meshcentral.com/*
// @grant    none
// @run-at   document-idle
// @license MIT
// @version 0.0.1.20230714135804
// @namespace https://greasyfork.org/users/866858
// @downloadURL https://update.greasyfork.org/scripts/470834/DOESN%27T%20WORK%20Meshcentral%20Prevent%20Filter%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/470834/DOESN%27T%20WORK%20Meshcentral%20Prevent%20Filter%20Autocomplete.meta.js
// ==/UserScript==

function modifyAutocomplete() {
    let searchInput = document.getElementById('SearchInput');
    if (searchInput) {
        searchInput.setAttribute('autocomplete', 'new-password');
    }
}

window.addEventListener('load', modifyAutocomplete);
