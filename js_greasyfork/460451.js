// ==UserScript==
// @name Remove Russian boxes in Sci-Hub
// @description: en Remove Russian boxes when displaying the PDF in Sci-Hub
// @match https://*sci-hub.ee/*
// @require https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @version 0.1
// @namespace https://greasyfork.org/users/1029280
// @description Remove Russian boxes when displaying the PDF gotten from Sci-Hub
// @downloadURL https://update.greasyfork.org/scripts/460451/Remove%20Russian%20boxes%20in%20Sci-Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/460451/Remove%20Russian%20boxes%20in%20Sci-Hub.meta.js
// ==/UserScript==



/*--- Use the jQuery contains selector to find content to remove.
Beware that not all whitespace is as it appears.
*/

function addGlobalStyle(css) {
var head, style;
head = document.getElementsByTagName('head')[0];
if (!head) { return; }
style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = css;
head.appendChild(style);
}

// @require https://cdn.bootcss.com/jquery/2.2.1/jquery.js
/* globals jQuery, $, waitForKeyElements */

var badDivs = $( "#menu");

addGlobalStyle('#pdf { top: 0px !important; } #main_content { margin-left: 0px !important; } #article { margin-left: 0 !important; }');

badDivs.remove ();

//-- Or use badDivs.hide(); to just hide the content.