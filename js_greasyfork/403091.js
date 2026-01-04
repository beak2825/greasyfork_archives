// ==UserScript==
// @name               AWS Docs Narrower Column
// @description        Makes text easier to read by not using 100% width
// @version            1
// @include            https://docs.aws.amazon.com/*
// @namespace https://greasyfork.org/users/153157
// @downloadURL https://update.greasyfork.org/scripts/403091/AWS%20Docs%20Narrower%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/403091/AWS%20Docs%20Narrower%20Column.meta.js
// ==/UserScript==


GM_addStyle_from_string(`
	#main-column {
		max-width: 650px !important;
		margin: auto !important;
	}
`);

function GM_addStyle_from_string(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}