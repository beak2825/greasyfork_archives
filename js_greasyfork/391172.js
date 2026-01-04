// ==UserScript==
// @name         ServiceNow Taller Code Merger
// @version      0.3
// @description  Makes the Code Comparison tool in ServiceNow taller
// @author       jgriffithSN
// @match        https://*.service-now.com/*merge_form_*_version*.do*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/387107
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/391172/ServiceNow%20Taller%20Code%20Merger.user.js
// @updateURL https://update.greasyfork.org/scripts/391172/ServiceNow%20Taller%20Code%20Merger.meta.js
// ==/UserScript==

const style = `
.CodeMirror-merge, .CodeMirror-merge .CodeMirror { height: 80vh !important; }
`;

(function() {
    'use strict';
    GM_addStyle(style);
})();