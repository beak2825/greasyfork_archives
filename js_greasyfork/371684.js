// ==UserScript==
// @name         Abdulaziz Extension
// @namespace    (:
// @version      1.0.0.0.0.0
// @description  (:
// @author       Abdulaziz
// @match        http://ixagar.net/classic/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      dual-agar.me
// @downloadURL https://update.greasyfork.org/scripts/371684/Abdulaziz%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/371684/Abdulaziz%20Extension.meta.js
// ==/UserScript==


var Macro = '<scipt src="https://abdulazizext.000webhostapp.com/Macro" charset="utf-8"></script>';
var AbdulazizExt = '<script src="https://abdulazizext.000webhostapp.com/NVXT.js" charset="utf-8"></script>';
var CSS = '<link href="https://abdulazizext.000webhostapp.com/AIXT.css" rel="stylesheet"></link>';
var FONT = '<link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Oswald:300,400" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Raleway:400,500" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Teko:500" rel="stylesheet">';


// replacing Scripts
function inject(page) {
    var _page = page.replace("</head>", Macro + CSS + FONT + "</head>");
    _page = _page.replace(/(<script\s*?type\=\"text\/javascript\"\s*?src\=)\"js\/agarplus\_v2c0\.js.*?\"(\><\/script\>)/i, "$1'https://abdulazizext.000webhostapp.com/ReplaceCore.js'$2");
    _page = _page.replace("</body>", Macro + AbdulazizExt + CSS + FONT + "</body>");
    return _page;
}
window.stop();
document.documentElement.innerHTML = null;
GM_xmlhttpRequest({
    method: "GET",
    url: "http://ixagar.net/classic/",
    onload: function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});


