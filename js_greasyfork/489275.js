// ==UserScript==
// @name         UCLA Bitwarden Autofill Fix
// @version      1.0
// @description  Fixes Bitwarden autofill not working on the UCLA login password field
// @match        https://shb.ais.ucla.edu/shibboleth-idp/profile/SAML2/*
// @namespace https://greasyfork.org/users/1271659
// @downloadURL https://update.greasyfork.org/scripts/489275/UCLA%20Bitwarden%20Autofill%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/489275/UCLA%20Bitwarden%20Autofill%20Fix.meta.js
// ==/UserScript==

var query = document.querySelector("#pass");
if (query) {
    query.setAttribute("placeholder", "Your UCLA Password");
}
