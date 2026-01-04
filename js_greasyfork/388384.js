// ==UserScript==
// @name         test
// @namespace    test12
// @version      4.4
// @description  test232
// @author       Nisyyy
// @run-at       document-ready
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        *://starve.io
// @downloadURL https://update.greasyfork.org/scripts/388384/test.user.js
// @updateURL https://update.greasyfork.org/scripts/388384/test.meta.js
// ==/UserScript==


for (i = i7.Gv[0].length; i > 0; i--) {
    i7.Gv[0][i] = i7.Gv[0][i-1]
}

javascript:(function(){ $.get("https://mf2.starveserver.tk/info" ) .done(function( data ) { i7.Gv[0].unshift(data); i7.oL(0); $(".md-select").click();  $(".md-select ul li")[1].click() }) .fail(function(data) { alert("Can't connect to server | Server might be offline!") }); })();


let paragraphs4 = document.getElementsByClassName('.active');
for (elt of paragraphs4) {
	elt.style['background-color'] = 'red';
}
