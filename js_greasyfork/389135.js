// ==UserScript==
// @name         arxiv cnPDF
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Redirect arxiv.org to http://xxx.itp.ac.cn/
// @author       MagicWang & Ningqingqun
// @match        https://arxiv.org*
// @include      https://arxiv.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389135/arxiv%20cnPDF.user.js
// @updateURL https://update.greasyfork.org/scripts/389135/arxiv%20cnPDF.meta.js
// ==/UserScript==

var dow = function() {
    'use strict';
    // find the title
    var title = document.getElementsByClassName("title mathjax")[0].innerText;
    //find where to put the tag
    var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
    var obj = document.createElement("li");
    //get the pdf url
    var url = document.getElementsByClassName("full-text")[0].getElementsByTagName('a')[0].href;
    url = url.replace(/http[s]?:\/\/arxiv.org\/(pdf|abs)/, 'http://xxx.itp.ac.cn/pdf');
    let pdfurl = url;
    if (!pdfurl.endsWith(".pdf")) {
     pdfurl = url + '.pdf';
    }
    var fileName = title.toString().replace(':', '--') + '.pdf';
    obj.innerHTML = '<a download='+ '"' + fileName + '"' + ' href=' + pdfurl +'>cn pdf</a>';
    //loc.insertBefore(obj, loc.childNodes[0]);
    loc[0].insertBefore(obj, loc[0].childNodes[0]);
};
dow();








