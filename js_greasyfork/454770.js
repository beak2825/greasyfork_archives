// ==UserScript==
// @name         Anki 答题优化
// @namespace    http://tampermonkey.net/
// @homepageURL      https://greasyfork.org/zh-CN/scripts/454770
// @version      1.2.1
// @description  Anki web版答题优化
// @author       ldm
// @match        *://ankiuser.net/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454770/Anki%20%E7%AD%94%E9%A2%98%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454770/Anki%20%E7%AD%94%E9%A2%98%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    function insertAfter(newe, targete ){
        var parent = targete. parentNode ;
        if (parent.lastChild == targete){
            parent.appendChild (newe ) ;
        } else {
            parent.insertBefore(newe, targete. nextSibling);
        }
    };
    var scroll = {
        ' ' : function() { document.getElementById("ansbuta").click(); },
    };
    var formElement = { 'input':true, 'button':true, 'select':true, 'textarea':true };
    window.addEventListener('keypress',
        function(e) {
            if (e.metaKey || e.ctrlKey || e.altKey ||
                formElement[e.target.tagName.toLowerCase()] || e.target.isContentEditable || document.designMode ==="on") {
                return; }
            var key = (e.shiftKey? 'S-' : '') + String.fromCharCode(e.charCode);
            if (scroll[key]) {
                scroll[key]();
                e.preventDefault();
                e.stopPropagation();
            }
        }, false);
    var css1 = [
	".container {",
	"    width: 98%;",
	"}"
	].join("\n");
    var css2 = [
    ".card {",
	"    font-size: 1.3em;",
	"}",
    "",
    "#front-question-part, #front-options {",
    "    font-size: 1em;",
	"}",
    "",
    ".single-tag {",
    "    font-size: 1em;",
 	"}",
    "",
	".footer{",
    	"font-size: 1.3em;",
	"}",
    "",
    ".bar_01 {",
    "    font-size: 0.8em;",
    "}",
    "",
    ".comment {",
    "    font-size: 1em;",
    "    }",
    "",
    "#back-notes {",
    "font-size: 1.3em;",
    "}",
    ].join("\n");
    var node1 = document.createElement("style");
    node1.type = "text/css";
    node1.appendChild(document.createTextNode(css1));
    var node2 = document.createElement("style");
    node2.type = "text/css";
    node2.appendChild(document.createTextNode(css2));
    var heads = document.getElementsByTagName("head");
    if (heads.length > 0) {
        heads[0].appendChild(node1);
    } else {
        // no head yet, stick it whereever
        document.documentElement.appendChild(node1);
    }
    var qua = document.getElementById("qa");
    insertAfter(node2, qua);
})();
