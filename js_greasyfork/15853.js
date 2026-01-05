// ==UserScript==
// @name        Yaplakal del Admin-block
// @description Removes block user "Administration"
// @namespace   lainscripts_scissors
// @include     http://www.yaplakal.com/*
// @include     http://yap.ru/*
// @version     2.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15853/Yaplakal%20del%20Admin-block.user.js
// @updateURL https://update.greasyfork.org/scripts/15853/Yaplakal%20del%20Admin-block.meta.js
// ==/UserScript==

var a = document.querySelectorAll('form > table[id^="p_row_"]');
var b = document.querySelectorAll('tr > .holder.newsbottom');
var words = /member1438|Administration/;
for (var i=0;i<a.length;i++) if (words.test(a[i].innerHTML))
a[i].parentNode.removeChild(a[i]);
for (var i=0;i<b.length;i++) if (words.test(b[i].innerHTML)){
var row = b[i].parentNode.rowIndex;
var table = b[i].parentNode.parentNode;
table.deleteRow(row);
table.deleteRow(row-1);
table.deleteRow(row-2);
}