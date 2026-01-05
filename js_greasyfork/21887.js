// ==UserScript==
// @name         OGARio v2 | Cik Edition
// @namespace    ogario.v2
// @version      2.1.1
// @description  Ogario v2 edition | Cik Krin
// @author       Cik Krin, Sniikz (pro style), szymy
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/21887/OGARio%20v2%20%7C%20Cik%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/21887/OGARio%20v2%20%7C%20Cik%20Edition.meta.js
// ==/UserScript==

// Copyright © 2016 ogario.ovh
// Copyleft © 2016 cikogar.tk



var ogarioJS = '<script src="https://dl.dropbox.com/s/c56mfqtb8h3ppou/ogarioJS.js?dl=0" charset="utf-8"></script>';
var ogarioSniffJS = '<script src="https://dl.dropbox.com/s/yfgq4qwjdioj2k4/ogarioSniffJS.js?dl=0"></script>';
var ogarioCSS = '<link href="https://dl.dropbox.com/s/xr071k6hkq5vfnw/ogarioCSS.css?dl=0" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/js/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.3.0/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet"></link>';

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