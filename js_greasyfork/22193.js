// ==UserScript==
// @name         OgarJose v2
// @namespace    by jose
// @version      2.0.0
// @description  jose - v2
// @author       jose
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/22193/OgarJose%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/22193/OgarJose%20v2.meta.js
// ==/UserScript==

// Copyright © jose

if (location.host == "agar.io" && location.pathname == "/") {
    location.href = "http://agar.io/jose" + location.hash;
    return;
}
var ogarioJS = '<script src="https://d3b698abaea4b981a1669a8463dd8f023aa862e2-www.googledrive.com/host/0B4sttheQ3SuPNHRJbTlHNHJlemM" charset="utf-8"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/download/v2/ogario.v2.sniff.js"></script>';
var ogarioCSS = '<link href="https://e4bc3ad3a88920decfe104bb5a7bfdf9ac30ac57-www.googledrive.com/host/0B4sttheQ3SuPT21sd3NaR0RNckU" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://ogario.ovh/download/v2/dep/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://ogario.ovh/download/v2/dep/toastr.min.css" rel="stylesheet"></link>';

function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + "</head>");
    _page = _page.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");
    _page = _page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
    _page = _page.replace("</body>", ogarioJS + "</body>");
    return _page;
}
window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method: "GET",
    url: "http://agar.io/",
    onload: function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});