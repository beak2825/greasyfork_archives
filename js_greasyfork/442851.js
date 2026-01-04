// ==UserScript==
// @name          Font facebook
// @include       *messenger.com*
// @include       *facebook.com*
// @description   Fix facebook font
// @version       1.0

// @namespace https://greasyfork.org/users/150554
// @downloadURL https://update.greasyfork.org/scripts/442851/Font%20facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/442851/Font%20facebook.meta.js
// ==/UserScript==
(function() {var css = ["body, button, input, label, select, td, textarea{",
"     font-family: Helvetica, Arial, sans-serif !important;",
"}"
].join("\n");
if (typeof GM_addStyle != 'undefined') {
 GM_addStyle(css);
 } else if (typeof PRO_addStyle != 'undefined') {
 PRO_addStyle(css);
 } else if (typeof addStyle != 'undefined') {
 addStyle(css);
 } else {
 var node = document.createElement('style');
 node.type = 'text/css';
 node.appendChild(document.createTextNode(css));
 var heads = document.getElementsByTagName('head');
 if (heads.length > 0) { heads[0].appendChild(node);
 } else {
 // no head yet, stick it whereever
 document.documentElement.appendChild(node);
 }
}})();