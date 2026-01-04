// ==UserScript==
// @name          AO3: Set Default Posting Language
// @author        Quihi
// @version       1.1
// @namespace     https://greasyfork.org/en/users/812553-quihi
// @description   Sets English as the default language to post works to Archive of Our Own.
// @match         https://archiveofourown.org/*works/new*
// @match     	  https://www.archiveofourown.org/*works/new*
// @downloadURL https://update.greasyfork.org/scripts/431973/AO3%3A%20Set%20Default%20Posting%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/431973/AO3%3A%20Set%20Default%20Posting%20Language.meta.js
// ==/UserScript==

try {
  document.getElementById("work_language_id").querySelectorAll("option[value='1']")[0].setAttribute("selected", "");
}
catch (error) {}

try {
	document.getElementById("language_id").querySelectorAll("option[value='1']")[0].setAttribute("selected", "");
}
catch (error) {}
