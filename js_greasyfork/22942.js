// ==UserScript==
// @name         Pugs Ogar
// @namespace    ogario.le
// @version      8.2.6
// @description  Pug Created A Agario "Exstention"
// @author       Puggy, Rodriguez
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/22942/Pugs%20Ogar.user.js
// @updateURL https://update.greasyfork.org/scripts/22942/Pugs%20Ogar.meta.js
// ==/UserScript==

// Copyright © 2016 Puglife - Tutorials

if (location.host == "agar.io" && location.pathname == "/") {
    location.href = "http://agar.io/PugsOGAR" + location.hash;
    return;
}

var ogarioJS = '<script src="http://www.googledrive.com/host/0BzYzpb8m9qBVYnNzTHBUd2VYd3c" charset="utf-8"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/download/v21/ogario.v2.sniff.js"></script>';
var ogarioCSS = '<link href="http://ogario.ovh/download/v21/ogario.v2.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://ogario.ovh/download/v2/dep/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://ogario.ovh/download/v2/dep/toastr.min.css" rel="stylesheet"></link>';
var PUG_CSS = '<link href="http://www.googledrive.com/host/0BzYzpb8m9qBVYzVOeE1aVGxRR1E" rel="stylesheet"></link>';
function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + PUG_CSS + "</head>");
    _page = _page.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");
    _page = _page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
    _page = _page.replace("</body>", ogarioJS +  "</body>");
    return _page;
}

window.stop();
document.documentElement.innerHTML = "";
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