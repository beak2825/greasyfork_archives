// ==UserScript==
// @name         Cik | Public Extension
// @namespace    Cik - Public Extension
// @version      1.3
// @description  Made by Cik | Host: Sniikz
// @author       Sniikz & Cik
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/21263/Cik%20%7C%20Public%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/21263/Cik%20%7C%20Public%20Extension.meta.js
// ==/UserScript==

var ogarioJS = '<script src="https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/ext.js"></script>';
var ogarioSniffJS = '<script src="https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/2.js"></script>';
var ogarioCSS = '<link href="https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/mek.css" rel="stylesheet"></link><link href="https://googledrive.com/host/0B-rarv9FlL8-WW9DOU5FTjBROFE/2.css" rel="stylesheet"></link><link href="https://googledrive.com/host/0B-rarv9FlL8-TklBOHVzMm0wMGs/css.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>';
var toastrCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"></link>';

// Inject OGARio LE
function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + "</head>");
    _page = _page.replace("agario.core.js", "");
    _page = _page.replace("</body>", ogarioJS + "</body>");
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
