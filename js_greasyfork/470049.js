// ==UserScript==
// @name Turn off input suggestions
// @version 1.0
// @author greasymonke
// @description Turn off input suggestions on all sites
// @match *
// @license MIT
// @grant none
// @namespace https://greasyfork.org/users/1118041
// @downloadURL https://update.greasyfork.org/scripts/470049/Turn%20off%20input%20suggestions.user.js
// @updateURL https://update.greasyfork.org/scripts/470049/Turn%20off%20input%20suggestions.meta.js
// ==/UserScript==

const turnOffAutocomplete = () => {
  document
    .querySelectorAll('input')
    .forEach((ele) => ele.setAttribute('autocomplete', 'off'));
};

turnOffAutocomplete();
