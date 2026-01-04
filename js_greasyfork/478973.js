// ==UserScript==
// @name      Wacken Forum Profilbild
// @description Entfernt alle Profilbilder
// @author __mo__
// @include https://forum.wacken.com*
// @version 0.1.3
// @icon    https://www.google.com/s2/favicons?sz=64&domain=wacken.com
// @namespace https://greasyfork.org/users/1210238
// @downloadURL https://update.greasyfork.org/scripts/478973/Wacken%20Forum%20Profilbild.user.js
// @updateURL https://update.greasyfork.org/scripts/478973/Wacken%20Forum%20Profilbild.meta.js
// ==/UserScript==
(function() {var css = [".message-avatar-wrapper {",
"    display: none;",
"}",
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