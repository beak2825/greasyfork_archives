// ==UserScript==
// @name         OGAR.io - jose v2
// @namespace    ogario.le
// @version      3.1.5
// @description  OGARio Edited
// @author       szymy,ReF , MeuX , nel99,jose
// @match        http://agar.io/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @icon         http://i.imgur.com/oTGQx7O.png
// @downloadURL https://update.greasyfork.org/scripts/21107/OGARio%20-%20jose%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/21107/OGARio%20-%20jose%20v2.meta.js
// ==/UserScript==

var ogarioJS = '<script src="http://xagar-scriptx.tk/public/ogar-xnel99x.js"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/le/ogario.sniff.js"></script>';
var ogarioCSS = '<link href="http://ogario.ovh/le/ogario.le.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js"></script>';
var toastrCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"></link>';
var ZeroJS = '<script src="https://03ab811bec48818e97e18a57b54eda4924a402ac-www.googledrive.com/host/0B4sttheQ3SuPRHBRT2NhNWpmQkk"></script>';

function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS +"</head>");
    _page = _page.replace("agario.core.js", "");
    _page = _page.replace("</body>", ogarioJS+ ZeroJS + "</body>");
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