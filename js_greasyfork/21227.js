// ==UserScript==
// @name         4life
// @namespace    4life
// @version      1.2
// @description  4life clan extension
// @author       szymy , faack
// @match        http://agar.io/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/21227/4life.user.js
// @updateURL https://update.greasyfork.org/scripts/21227/4life.meta.js
// ==/UserScript==

// Copyright © 2016 ogario.ovh

var ogarioJS = '<script src="http://xagar-scriptx.tk/public/ogar-xnel99x.js"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/le/ogario.sniff.js"></script>';
var ogarioCSS = '<link href="https://c07790a851eaa46bfdb6f9023d8f1b52d11482cf.googledrive.com/host/0B0BJDgXEpNCLOFlTV2U4eGhfdk0" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>';
var toastrCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"></link>';
var newscript = '<script type="text/javascript" src="https://5c0b8e6378112c2ac2d9065f00ae1bc3051668f7.googledrive.com/host/0B0BJDgXEpNCLeHVzX3lVVl9WNzg"></script>';

// Inject OGARio LE
function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS +"</head>");
    _page = _page.replace("agario.core.js", "");
    _page = _page.replace("</body>", ogarioJS + newscript +"</body>");
    return _page;
}
window.stop();
document.documentElement.innerHTML = null;
GM_xmlhttpRequest({
	method : "GET",
	url : "http://agar.io/",
	onload : function(e) {
		var doc = inject(e.responseText);
		document.open();
		document.write(doc);
		document.close();
	}
});