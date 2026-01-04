// ==UserScript==
// @name         Botu Predator
// @namespace    https://qinlili.bid
// @version      0.1
// @description  截取博图加密PDF
// @author       You
// @match        *://www.cnbooksearch.com/CheckIpForRead.aspx?*
// @match        *://*/*/CheckIpForRead.aspx?*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/439049/Botu%20Predator.user.js
// @updateURL https://update.greasyfork.org/scripts/439049/Botu%20Predator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loadUrl= new Function(document.body.getAttribute("onload").replace("javascript:","").replace("OpenURL","OpenUrlHook"));
    document.body.onload="";
    document.body.setAttribute("onload","");
    console.log("catch onload event!")
    window.OpenUrlHook=function(nouse0,pdfurl,nouse1,nouse2){
        console.log("Got PDF URL:"+pdfurl);
        fetch(pdfurl).then(res => res.blob().then(blob => {
            var bloburl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            var filename = "[尚未解密]"+document.title+".pdf";
            a.href = bloburl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(bloburl);
        }))
    }
    loadUrl();
})();