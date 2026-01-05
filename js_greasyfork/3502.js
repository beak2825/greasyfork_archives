// ==UserScript==
// @name           [Japanese] Ehon Navi Focus Check Disabler
// @description    Disables the unfocus screen when unfocused from a book
// @author         Kai Krause (kaikrause95@gmail.com)
// @match          http://*.ehonnavi.net/*
// @match          https://*.ehonnavi.net/*
// @version        0.3
// @grant          none
// @namespace https://greasyfork.org/users/3656
// @downloadURL https://update.greasyfork.org/scripts/3502/%5BJapanese%5D%20Ehon%20Navi%20Focus%20Check%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/3502/%5BJapanese%5D%20Ehon%20Navi%20Focus%20Check%20Disabler.meta.js
// ==/UserScript==

function checkWindow() {
}

function embedFunction(s) {
document.body.appendChild(document.createElement('script'))
.innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
}

embedFunction(checkWindow);