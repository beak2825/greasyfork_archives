// ==UserScript==
// @name         AWS - Autofill Switch Role
// @namespace    https://github.com/ecklf
// @version      0.1
// @description  Autofill switch role params
// @author       ecklf
// @icon         https://aws.amazon.com/favicon.ico
// @match        https://*.signin.aws.amazon.com/switchrole*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518799/AWS%20-%20Autofill%20Switch%20Role.user.js
// @updateURL https://update.greasyfork.org/scripts/518799/AWS%20-%20Autofill%20Switch%20Role.meta.js
// ==/UserScript==

const inputTypes = [
    window.HTMLInputElement,
    window.HTMLSelectElement,
    window.HTMLTextAreaElement,
];

const triggerInputChange = (node, value = '') => {
    if ( inputTypes.indexOf(node.__proto__.constructor) >-1 ) {
        const setValue = Object.getOwnPropertyDescriptor(node.__proto__, 'value').set;
        const event = new Event('input', { bubbles: true });
        setValue.call(node, value);
        node.dispatchEvent(event);
    }
};


(function() {
  "use strict";
  window.addEventListener('load', function() {
    const url = new URL(window.location.href);
    const computeParams = url.searchParams.get("compute_extension_params");
    if (!computeParams) return;
    const params = JSON.parse(computeParams);
    const accountIdInput = document.getElementById("accountId");
    if (accountIdInput) triggerInputChange(accountIdInput, params.accountId);
    const roleNameInput = document.getElementById("roleName");
    if (roleNameInput) triggerInputChange(roleNameInput, params.roleName);
    const displayNameInput = document.getElementById("displayName");
    if (displayNameInput) triggerInputChange(displayNameInput, params.displayName);
  }, false);
})();