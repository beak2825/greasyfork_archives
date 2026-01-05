// ==UserScript==
// @name         Status Searchable Requester
// @description  Replace status page contact links with a HIT search for that requester, and adds a separate contact link.
// @author       TheFrostlixen
// @version      0.2
// @namespace    https://greasyfork.org/en/users/34060
// @match        https://www.mturk.com/mturk/statusdetail?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18083/Status%20Searchable%20Requester.user.js
// @updateURL https://update.greasyfork.org/scripts/18083/Status%20Searchable%20Requester.meta.js
// ==/UserScript==

// == CHANGELOG ==
// v0.1          Does what it should, quick and dirty implementation

Array.prototype.forEach.call( document.querySelectorAll('[title="Contact this Requester"'), function(el) {
	var tag = document.createElement('a');
	tag.href = el.href;
	el.href = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=" + tag.search.split(/=|&/)[1];
	el.target = "_blank";
	tag.innerHTML = "✉";
	el.parentElement.appendChild( tag );
});
