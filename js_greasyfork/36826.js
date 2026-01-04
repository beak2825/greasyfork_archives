// ==UserScript==
// @name        MTurk Dashboard Style
// @version     0.1.4
// @description Improve MTurk dashboard's layout/style.
// @author      parseHex
// @namespace   https://greasyfork.org/users/8394
// @match       https://worker.mturk.com/dashboard*
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/36826/MTurk%20Dashboard%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/36826/MTurk%20Dashboard%20Style.meta.js
// ==/UserScript==

(function () {
'use strict';

const prefix = '#MainContent > .row';
const activityColumn = prefix + ' > .col-md-8';
const otherColumn = prefix + ' > .col-md-4';

const css = `
${activityColumn} {
	right: 0;
	width: 40%;
	padding-left: 0;
	padding-right: 0;
}

/* activity column title and table */
${activityColumn} > .m-b-md > .col-xs-12 {
	padding-left: 0;
}

${otherColumn} {
	left: 0;
	width: 60%;
	padding-left: 0;
	padding-right: 0;
}

${otherColumn} .row.m-b-xl {
	display: inline-block;
	width: 50%;
	float: left;
	position: relative;
	min-height: 1px;
	padding-left: 0.7142rem;
	padding-right: 0.7142rem;
}

${otherColumn} #dashboard-hits-overview .col-xs-12 {
	padding-right: 0;
}
`;

function init() {
	GM_addStyle(css);
}

init();

}());
