// ==UserScript==
// @name         Show customfield IDs in Jira screen editor
// @namespace    http://schuppentier.org/
// @version      1.0
// @description  This enhances the JIra screen editor by also showing the field IDs in addition to the name as the name is not required to be unique.
// @author       Dennis Stengele
// @match        https://*.atlassian.net/secure/admin/ConfigureFieldScreen.jspa*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @require      https://bowercdn.net/c/arrive-2.4.1/minified/arrive.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481958/Show%20customfield%20IDs%20in%20Jira%20screen%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/481958/Show%20customfield%20IDs%20in%20Jira%20screen%20editor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.arrive("div#screen-editor tr.aui-restfultable-readonly", function() {
        const fieldId = this.getAttribute("data-id")
        const cell = this.querySelector("td.field-name-cell")
        const newValue = `${cell.textContent} (${fieldId})`
        cell.textContent = newValue
    })
})();