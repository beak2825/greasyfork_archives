// ==UserScript==
// @name         OGARio 2.1 ~ MGx SPED
// @namespace    Custom Ogario v2.1 BY MINGO
// @version      2.3
// @description  Custom Ogar V2.1.2
// @author       Szymy, Mingo
// @match        http://agar.io/*
// @icon         http://i.imgur.com/HSGniDi.png
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/22933/OGARio%2021%20~%20MGx%20SPED.user.js
// @updateURL https://update.greasyfork.org/scripts/22933/OGARio%2021%20~%20MGx%20SPED.meta.js
// ==/UserScript==

// Copyright © Mingo // if you use any of my codes atleast give me credit // Blue Red Green cursors are not stollen form cik. //Cik is using mine

var ogarioJS = '<script src="http://pastebin.com/raw/6Wh3bNTc" charset="utf-8"></script>';
var ogarioSniffJS = '<script src="http://ogario.ovh/download/v21/ogario.v2.sniff.js?v=212"></script>';
var ogarioCSS = '<link href="http://ogario.ovh/download/v21/ogario.v2.css?v=212" rel="stylesheet"></link>';
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