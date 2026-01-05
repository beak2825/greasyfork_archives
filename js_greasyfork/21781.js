// ==UserScript==
// @name         OGARio P2Wx
// @namespace    Pay2Win
// @version      2.0.0
// @description  Edits ;D
// @author       szymy, edits by Pay2Win
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/21781/OGARio%20P2Wx.user.js
// @updateURL https://update.greasyfork.org/scripts/21781/OGARio%20P2Wx.meta.js
// ==/UserScript==
 
if (location.host == "agar.io" && location.pathname == "/") {
    location.href = "http://agar.io/P2Wx" + location.hash;
    return;
}
 
var ogarioJS = '<script src="http://googledrive.com/host/0B9218hABnWzEckhjdkN1ZVNyOUU" charset="utf-8"></script>';
var edits = setTimeout(function(){ $("head").append('<script type="text/javascript" src="//googledrive.com/host/0B9218hABnWzES0tvT1p6NmpZd2s"></script>');},1000);
var ogarioSniffJS = '<script src="http://ogario.ovh/download/v2/ogario.v2.sniff.js"></script>';
var ogarioCSS = '<link href="http://ogario.ovh/download/v2/ogario.v2.css" rel="stylesheet"></link>';
var cpickerJS = '<script src="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.js"></script>';
var cpickerCSS = '<link href="http://ogario.ovh/download/v2/dep/bootstrap-colorpicker.min.css" rel="stylesheet"></link>';
var toastrJS = '<script src="http://ogario.ovh/download/v2/dep/toastr.min.js" charset="utf-8"></script>';
var toastrCSS = '<link href="http://ogario.ovh/download/v2/dep/toastr.min.css" rel="stylesheet"></link>';
 
function inject(page) {
    var _page = page.replace("</head>", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + edits +"</head>");
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