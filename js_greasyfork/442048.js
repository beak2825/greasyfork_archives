// ==UserScript==
// @name         Fix Streamate Earnings Table Formatting
// @namespace    https://greasyfork.org/en/users/870933
// @version      0.1
// @description  The new HTML code on the earnings page is being overruled by some CSS. This corrects the CSS.
// @author       LintillaTaylor
// @match        https://www.streamatemodels.com/smm/reports/earnings/EarningsReportPivot.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442048/Fix%20Streamate%20Earnings%20Table%20Formatting.user.js
// @updateURL https://update.greasyfork.org/scripts/442048/Fix%20Streamate%20Earnings%20Table%20Formatting.meta.js
// ==/UserScript==

function addCss(rule) {
	let css = document.createElement('style');
	css.type = 'text/css';
	css.appendChild(document.createTextNode(rule));
  document.getElementsByTagName("head")[0].appendChild(css);
}

let rule = '.collapse.show {display:table-row}';

addCss(rule);