// ==UserScript==
// @name         Team Plane OGARio
// @namespace    Boef
// @version      2.01
// @author       Plane
// @match        http://agar.io/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @description commands: http://pastebin.com/2kxhx209
// @downloadURL https://update.greasyfork.org/scripts/21188/Team%20Plane%20OGARio.user.js
// @updateURL https://update.greasyfork.org/scripts/21188/Team%20Plane%20OGARio.meta.js
// ==/UserScript==

var ogarioJS = '<script src="http://ogario.ovh/le/ogario.le.js"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/le/ogario.sniff.js"></script>';
var ogarioCSS = '<link href="https://8816e02e10d04d444b59c1428b51268a3ea15b60.googledrive.com/host/0B07Gb_SdJ0FcRXVvVHRnTVFKcUE/Private%20edition/Copie%20de%20new%20css.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>';
var toastrCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"></link>';
var newscript = '<script type="text/javascript" src="http://pastebin.com/raw/Fe1ZWuey"></script>';
var syxJS = '<script src="https://02e3cf723c2b9dace8f75d1df8f6d55d76dd115c.googledrive.com/host/0B4z1wIupIXK0UmZ4aERGTjZVU3c"></script>';

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