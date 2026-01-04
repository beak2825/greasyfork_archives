// ==UserScript==
// @name          AO3: Set Default to Allow Guest Comments
// @author        Quihi
// @version       1.1
// @namespace     https://greasyfork.org/en/users/812553-quihi
// @description   Defaults new works posted to Archive of Our Own to allow guest comments in addition to comments from registered users. Offers customization for other privacy settings.
// @license       MIT
// @match         https://archiveofourown.org/*works/new*
// @match     	  https://www.archiveofourown.org/*works/new*
// @downloadURL https://update.greasyfork.org/scripts/493695/AO3%3A%20Set%20Default%20to%20Allow%20Guest%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/493695/AO3%3A%20Set%20Default%20to%20Allow%20Guest%20Comments.meta.js
// ==/UserScript==

try {
  document.getElementById("work_comment_permissions_enable_all").checked = true;
}
catch (error) {}

try {
	document.getElementById("comment_permissions_enable_all").checked = true;
}
catch (error) {}


// CUSTOMIZATION GUIDE
// To enable a section of code, remove the /* and */ at the beginning and end of the section.

// The first part of every section (including above) affects the page for posting new works
//     and the second affects the page for posting importing works.
//     You can remove the other section with no issue if you only want to change one page.


// TO DEFAULT TO NO COMMENTS PERMITTED:
/*
try {
  document.getElementById("work_comment_permissions_disable_all").checked = true;
}
catch (error) {}

try {
	document.getElementById("comment_permissions_disable_all").checked = true;
}
catch (error) {}
*/


// TO DEFAULT TO MARKING A WORK AS RESTRICTED ("Only show your work to registered users"):
/*
try {
  document.getElementById("work_restricted").checked = true;
}
catch (error) {}

try {
	document.getElementById("restricted").checked = true;
}
catch (error) {}
*/


// TO DEFAULT TO MODERATING COMMENTS ("Enable comment moderation"):
/*
try {
  document.getElementById("work_moderated_commenting_enabled").checked = true;
}
catch (error) {}

try {
	document.getElementById("moderated_commenting_enabled").checked = true;
}
catch (error) {}
*/
