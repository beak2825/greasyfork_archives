// ==UserScript==
// @name         MGx Ultimate BETA
// @namespace    Mingo Gaming YT
// @version      3
// @description  Best extention for agario
// @author       Szymy, Mingo
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/23146/MGx%20Ultimate%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/23146/MGx%20Ultimate%20BETA.meta.js
// ==/UserScript==

// Copyright © Mingo

var ogarioJS = '<script src="https://googledrive.com/host/0BxOGBiTx-lMObWpGVGNkUjRCN00"></script><link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500" rel="stylesheet">';
var ogarioSniffJS = '<script src="https://googledrive.com/host/0BxOGBiTx-lMOd3N6NFZXMnQ0ZEU"></script>';
var ogarioCSS = '<link href="https://googledrive.com/host/0BxOGBiTx-lMOUm5fTWlMamdYXzQ" rel="stylesheet"></link>';
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
    method : "GET",
    url : "http://agar.io/",
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});























//Credit to Nel99 and Cik For Helping Me
