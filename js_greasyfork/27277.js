// ==UserScript==
// @name         arxiv titleAsPDFName
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  when download paper from arxiv.org, automate set the file name as the paper's title
// @author       EvanL00
// @match        https://arxiv.org*
// @include      https://arxiv.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27277/arxiv%20titleAsPDFName.user.js
// @updateURL https://update.greasyfork.org/scripts/27277/arxiv%20titleAsPDFName.meta.js
// ==/UserScript==

var dow = function() {
    'use strict';
    // find the title
    var title = document.getElementsByClassName("title mathjax")[0].innerText;
    //find where to put the tag
    var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
    var obj = document.createElement("li");
    //get the pdf url
    var urls = document.getElementsByClassName("full-text")[0].getElementsByTagName('a');
    for (const url of urls) {
        if (url.className.includes('download-pdf')) {
            let pdfurl = url.href;
            if (!pdfurl.endsWith(".pdf")) {
                pdfurl = url + '.pdf';
            }
            var fileName = title.toString().replace(':', '--') + '.pdf';
            obj.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + pdfurl +'>Save as pdf</a>';
            //loc.insertBefore(obj, loc.childNodes[0]);
            loc[0].insertBefore(obj, loc[0].childNodes[0]);
        }

    }
    //var getUrlHttp = new XMLHttpRequest();
    //getUrlHttp.open('GET', url, true);
    //getUrlHttp.send(null);
    //var res = getUrlHttp.responseText;
    //var myRex = /(http:\/\/ieee[^"]+)/;
    //var pdfurl = res.match(myRex)[0];

};
dow();
