// ==UserScript==
// @name         Beestar
// @namespace    beestar
// @version      0.1
// @description  I Love Beestar
// @author       James
// @match        https://w2.beestar.org/*
// @downloadURL https://update.greasyfork.org/scripts/388952/Beestar.user.js
// @updateURL https://update.greasyfork.org/scripts/388952/Beestar.meta.js
// ==/UserScript==

(function() {
    var index = document.body.outerHTML.indexOf("student_id");
    if(index>0){
        var attrs = document.body.getAttributeNames();
        for(var i = 0; i < attrs.length; ++i){
            document.body.removeAttribute(attrs[i]);
        }
        var htm = document.body.outerHTML;
        var win = window.open("", "Printable");
        win.document.body.outerHTML = htm;
    }

    index = document.body.outerHTML.indexOf("first iframe with id='if_parent'");
    if(index>0){
        var pw = unsafeWindow;
        setTimeout(function(){ pw.close()}, 1000);
    }
})();