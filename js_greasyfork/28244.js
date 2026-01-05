// ==UserScript==
// @name         Allow Text Selection
// @namespace    https://greasyfork.org/scripts/28244
// @version      2018.0122
// @description  Allow Text Selection.
// @include      http://blog.kq88.com/*
// @include      http://news.missevan.com/*
// @include      https://www.bilibili.com/read/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/28244/Allow%20Text%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/28244/Allow%20Text%20Selection.meta.js
// ==/UserScript==
(function() {
    function allowTextSelection() {
        window.console && console.log("allowTextSelection");
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = "*,p,div{user-select:text !important;-moz-user-select:text !important;-webkit-user-select:text !important;}";
        document.head.appendChild(style);
        var elArray = document.body.getElementsByTagName("*");
        for (var i = 0; i < elArray.length; i++) {
            var el = elArray[i];
            el.onselectstart = el.ondragstart = el.ondrag = el.oncontextmenu = el.onmousedown = el.onmouseup = function() {
                return true;
            };
            if (el instanceof HTMLInputElement && [ "text", "password", "email", "number", "tel", "url" ].indexOf(el.type.toLowerCase()) > -1) {
                el.removeAttribute("disabled");
                el.onkeydown = el.onkeyup = function() {
                    return true;
                };
            }
        }
    }
    allowTextSelection();
})();