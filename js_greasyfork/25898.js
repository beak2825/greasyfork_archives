// ==UserScript==
// @name         ZTx
// @namespace    ZTx 2016
// @version      1.1
// @description  ZTx Remastered
// @author       Theo, Real
// @core         szymy
// @original     ZT Acydwarp, Akira, Nilbek & Singh_SY
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/25898/ZTx.user.js
// @updateURL https://update.greasyfork.org/scripts/25898/ZTx.meta.js
// ==/UserScript==

// Check location
if (location.host == "agar.io" && location.pathname == "/") {
    location.href = "http://agar.io/ztx" + location.hash;
    return;
}

// Dependencies
var ztxCSS =     '<link href="http://theo.orgfree.com/extensiones/ztx/ztx.css" rel="stylesheet"></link>';
var ztxSniffJS = '<script src="http://theo.orgfree.com/extensiones/ztx/ztx.sniff.js"></script>';
var ztxJS =      '<script src="http://theo.orgfree.com/extensiones/ztx/ztx.js" charset="utf-8"></script>';

var cpickerCSS = '<link href="http://cdn.ogario.ovh/static/css/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrCSS =  '<link href="http://cdn.ogario.ovh/static/css/toastr.min.css" rel="stylesheet"></link>';
var switchCSS =  '<link href="http://cdn.ogario.ovh/static/css/switchery.min.css" rel="stylesheet"></link>';
var rangeCSS =   '<link href="http://cdn.ogario.ovh/static/css/rangeslider.css" rel="stylesheet"></link>';
var perfectCSS = '<link href="http://cdn.ogario.ovh/static/css/perfect-scrollbar.min.css" rel="stylesheet"></link>';

var cpickerJS =  '<script src="http://cdn.ogario.ovh/static/js/bootstrap-colorpicker.min.js"></script>';
var toastrJS =   '<script src="http://cdn.ogario.ovh/static/js/toastr.min.js"></script>';
var switchJS =   '<script src="http://cdn.ogario.ovh/static/js/switchery.min.js"></script>';
var rangeJS =    '<script src="http://cdn.ogario.ovh/static/js/rangeslider.min.js"></script>';
var perfectJS =  '<script src="http://cdn.ogario.ovh/static/js/perfect-scrollbar.jquery.min.js"></script>';

// Inject OGARio
function inject(page) {
    page = page.replace("</head>", cpickerCSS + toastrCSS + switchCSS + rangeCSS + perfectCSS + ztxCSS + cpickerJS + toastrJS + switchJS + rangeJS + perfectJS + ztxSniffJS + "</head>");
    page = page.replace(/<script.*?>[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");
    page = page.replace(/<script.*?src=".*?agario\.core\.js.*?><\/script>/, "");
    page = page.replace("</body>", ztxJS + "</body>");
    return page;
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