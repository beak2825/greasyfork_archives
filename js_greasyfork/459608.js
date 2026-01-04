// ==UserScript==
// @name          Pepper.pl Old font
// @name:pl       Pepper.pl Stara czcionka
// @description   Restores old font on Pepper.pl
// @description:pl Przywraca starą czcionkę na Pepper.pl
// @namespace     http://greasyfork.org
// @include       http://pepper.pl/*
// @include       https://pepper.pl/*
// @include       http://*.pepper.pl/*
// @include       https://*.pepper.pl/*
// @run-at       document-end
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/459608/Pepperpl%20Old%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/459608/Pepperpl%20Old%20font.meta.js
// ==/UserScript==
(function() {var css = ["body {font-family:Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif !important;}"
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