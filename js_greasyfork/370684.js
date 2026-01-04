// ==UserScript==
// @name         Dual Agar
// @version      3.0.1
// @description  Just Dual Agar
// @author       Snake & Zer0
// @match        http://dual-agar.me/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      dual-agar.me
// @namespace http://snake.freetzi.com/install.user.js
// @downloadURL https://update.greasyfork.org/scripts/370684/Dual%20Agar.user.js
// @updateURL https://update.greasyfork.org/scripts/370684/Dual%20Agar.meta.js
// ==/UserScript==




var miScript = '<script src="https://pastebin.com/raw/s13ucrss" charset="utf-8"></script>';
var SnakeJS = '<script src="https://szx.000webhostapp.com/snake/Snake.js"></script>';
var mainCSS = '<link href="https://szx.000webhostapp.com/snake/dualagarmaincss.css" rel="stylesheet"></link>';
// Inject Snake
function inject(page) {
  var _page = page.replace("</head>", mainCSS + "</head>");
     _page = _page.replace(/(<script\s*?type\=\"text\/javascript\"\s*?src\=)\"js\/agarplus\_v2c0\.js.*?\"(\><\/script\>)/i, "$1'https://szx.000webhostapp.com/snake/Core.js'$2");
   // page= page.replace('http://dual-agar.me/js/agarplus_v2c0.js', '');
    _page = _page.replace('</body>', SnakeJS + mainCSS + miScript+ '</body>');
    return _page;






   }

window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : 'http://dual-agar.me/',
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});