// ==UserScript==
// @name         Fire's Men Extension
// @version      1.0
// @description  Fire extension
// @author       Toby's Men
// @match        http://dual-agar.online/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      dual-agar.online
// @namespace http://snake.freetzi.com/install.user.js
// @downloadURL https://update.greasyfork.org/scripts/34374/Fire%27s%20Men%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/34374/Fire%27s%20Men%20Extension.meta.js
// ==/UserScript==

var SnakeJS = '<script src="https://szx.000webhostapp.com/snake/Snake.js"></script>';
var mainCSS = '<link href="https://szx.000webhostapp.com/snake/dualagarmaincss.css" rel="stylesheet"></link>';
// Inject Snake
function inject(page) {
  var _page = page.replace("</head>", mainCSS + "</head>");
     _page = _page.replace(/(<script\s*?type\=\"text\/javascript\"\s*?src\=)\"js\/agarplus\_v2c0\.js.*?\"(\><\/script\>)/i, "$1'https://szx.000webhostapp.com/snake/Core.js'$2");
   // page= page.replace('http://dual-agar.online/js/agarplus_v2c0.js', '');
    _page = _page.replace('</body>', SnakeJS + mainCSS + '</body>');
    return _page;
}
window.stop();
document.documentElement.innerHTML = "";
GM_xmlhttpRequest({
    method : "GET",
    url : 'http://dual-agar.online/',
    onload : function(e) {
        var doc = inject(e.responseText);
        document.open();
        document.write(doc);
        document.close();
    }
});
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);

var EjectDown = false;

var speed = .000000000000000000000000000000000000000000000000000001; //in ms

function keydown(event) {
    if (event.keyCode == 87 && EjectDown === false) { // key W
        EjectDown = true;
        setTimeout(eject, speed);
    }
}
function keyup(event) {
    if (event.keyCode == 87) { // key W
        EjectDown = false;
    }
}

function eject() {
    if (EjectDown) {
        window.onkeydown({keyCode: 87}); // key W
        window.onkeyup({keyCode: 87});
        setTimeout(eject, speed);
    }
}

//© 2017. Toby's Men. All Rights Reserved