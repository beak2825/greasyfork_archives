// ==UserScript==
// @name         Epstyle
// @namespace    EnderPhase
// @version      0.1.1
// @description  Meet new EnderPhaseX
// @author       AeRO
// @match        *://agar.io/
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/19544/Epstyle.user.js
// @updateURL https://update.greasyfork.org/scripts/19544/Epstyle.meta.js
// ==/UserScript==

var EnderPhaseCSS = '<link href="http://dum5nomg.tk/epxx.css" type="text/css" rel="stylesheet"></link>';

function inject(page) {
    var _page = page.replace(/main_out.js/i, "http://51.254.206.49/");
    _page = _page.replace(/agario.core.js/i, "http://51.254.206.49/core.js");
    _page = _page.replace("</head>", EnderPhaseCSS + "</head>");
   

    return _page;
}

window.stop();
document.documentElement.innerHTML = null;
GM_xmlhttpRequest({
	method : "GET",
	url : "http://agar.io/",
	onload : function(event) {
        var doc = inject(event.responseText);
		document.open();
        
		document.write(doc);
		document.close();
	}
    
});