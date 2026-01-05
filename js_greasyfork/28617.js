// ==UserScript==
// @name         SimonX
// @namespace    SimonX
// @description  Best Gota Extension
// @author       Simon Chanderlon
// @version      1.0
// @match        http://gota.io/web/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      gota.io
// @downloadURL https://update.greasyfork.org/scripts/28617/SimonX.user.js
// @updateURL https://update.greasyfork.org/scripts/28617/SimonX.meta.js
// ==/UserScript==

var Simonxjs = '<script src="http://ben.epizy.com/Extensions/ZTx/js/ZTxjs.js"></script>';
var Simonxcss = '<link rel="stylesheet" href="http://ben.epizy.com/Extensions/ZTx/js/ZTxcss.css"></link>';

function inject(ZTx) {
    Simonx = Simonx.replace(/<script.*?src=".*?gota\.js.*?><\/script>/, "");
    Simonx = Simonx.replace("</head>", ZTxcss + "</head>");
    Simonx = Simonx.replace("</body>", ZTxjs + "</body>");
    return Simonx;
}
window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : "http://gota.io/web/",
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.create(doc);
        document.close();
    }
});
