// ==UserScript==
// @name         Ogar - jose 2.1
// @namespace    ogario.v2
// @version      2.1.5
// @description  Unoffical Polish MOD/modifications
// @author       ext:szymy, edit:jose
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/22391/Ogar%20-%20jose%2021.user.js
// @updateURL https://update.greasyfork.org/scripts/22391/Ogar%20-%20jose%2021.meta.js
// ==/UserScript==

// Copyright © 2016 Jose Vnzl

if (location.host == "agar.io" && location.pathname == "/") {
    location.href = "http://agar.io/Vnzl" + location.hash;
    return;
}

var ogarioJS = '<script src="http://vnzljose.esy.es/Jose.js" charset="utf-8"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/download/v21/ogario.v2.sniff.js"></script>';
var ogarioCSS = '<link href="http://vnzljose.esy.es/jose.css" rel="stylesheet"></link>';
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
