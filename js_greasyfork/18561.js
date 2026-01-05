// ==UserScript==
// @name         Full width tables
// @namespace    http://github.com/kba
// @version      0.1
// @description  Full-width tables
// @author       kba
// @match        */*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18561/Full%20width%20tables.user.js
// @updateURL https://update.greasyfork.org/scripts/18561/Full%20width%20tables.meta.js
// ==/UserScript==

var elems = document.querySelectorAll("table");
for (var i = 0; i < elems.length; i++) {
	elems[i].style.width = '100%';
}
