// ==UserScript==
// @name          Readable elmbranch.org 2 - The Work Around
// @description   Makes elmbranch.org's homepage readable. Only use if Readable elmbranch.org makes other pages unreadable. This is a workaround for a misbehaving mobile browser. Makes the homepage readable but ugly.
// @author        oldmobie
// @homepage      
// @include       http://www.elmbranch.org/
// @version       
// @namespace https://greasyfork.org/users/687374
// @downloadURL https://update.greasyfork.org/scripts/411328/Readable%20elmbranchorg%202%20-%20The%20Work%20Around.user.js
// @updateURL https://update.greasyfork.org/scripts/411328/Readable%20elmbranchorg%202%20-%20The%20Work%20Around.meta.js
// ==/UserScript==
(function() {var css = ["body.custom-background {",
"    background-color: #2B599C;",
"    color: black;",
"}",
"",
"body.custom-background {",
"    background-image: url(null);",
"}",
"",
"h1.title-page {",
"    color: black;",
"}",
"p {",
"    color: black;",
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