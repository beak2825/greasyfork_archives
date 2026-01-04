// ==UserScript==
// @name          iTunes Button 2021
// @namespace    https://twitter.com/ios_Apk
// @version      0.1
// @description iTunes Button 2021 [Open in iTunes] Button. iTunes / Raouf Bouna
// @author       R-Bouna
// @match         https://apps.apple.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385899/iTunes%20Button%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/385899/iTunes%20Button%202021.meta.js
// ==/UserScript==

(function() {
    if(document.title.match("Mac App Store")==null){
        var url = location.href.split('#')[0];
        var regex = /\/id([0-9]+)/;
        var match = url.match(regex);
        var id = null;
        if(match!==null){
            id = match[1];
        }
        if(id!==null){
            var xurl = "itmss://apps.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id="+id+"&mt=8&at=10laHZ";
            var mydiv = document.createElement("div");
            var html = '<style>#xf_itunes_link{display: inline-block;padding: 8px 22px;background: #228fff;color: #fff;font-size: 16px;border-radius: 6px;}#xf_itunes_link:hover{text-decoration:none}</style>';
            html = html + '<a id="xf_itunes_link" href="'+xurl+'">iTunes - Raouf Bouna</a>';
            mydiv.innerHTML = html;
            document.getElementsByClassName("product-header")[0].appendChild(mydiv);
        }
    }
})();