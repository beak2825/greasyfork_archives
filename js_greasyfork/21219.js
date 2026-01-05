// ==UserScript==
// @name         Private Extension
// @version      6.69
// @namespace    Private Extension
// @description  Private
// @author       Rain - SYx (Edit By Timeh)
// @match        http://agar.io/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21219/Private%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/21219/Private%20Extension.meta.js
// ==/UserScript==
 
var ogarioJS = '<script src="https://dl.dropbox.com/s/c8o6zloze5shtnq/ogario.le.js?dl=0"></script>';
var ogarioSniffJS = '<script src="https://dl.dropbox.com/s/gn6roba4621w6z5/ogario.sniff.js?dl=0"></script>';
var ogarioCSS = '<link href="https://dl.dropbox.com/s/0b7yx14p1k7ndv1/ogario.le.css?dl=0" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>';
var toastrCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"></link>';
var syxJS = '<script src="https://dl.dropbox.com/s/y5i52ca5a5u52ql/syxJS.js?dl=0"></script>';
 
// Bonde
// Tá
// Formado
// Pra jogar
// Lagar.io
// Inject OGARio LE
function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + syxJS +"</head>");
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