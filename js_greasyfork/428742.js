// ==UserScript==
// @name         arxiv save pdf
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  when download paper from arxiv.org, automate set the file name as the paper's title
// @author       woonchao
// @match        https://arxiv.org*
// @include      https://arxiv.org*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428742/arxiv%20save%20pdf.user.js
// @updateURL https://update.greasyfork.org/scripts/428742/arxiv%20save%20pdf.meta.js
// ==/UserScript==
// modified from https://greasyfork.org/zh-CN/scripts/27277-arxiv-titleaspdfname

var dow = function() {
    'use strict';
    // find the title
    var title = document.getElementsByClassName("title mathjax")[0].innerText;
    //find where to put the tag
    var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
    var obj = document.createElement("li");
    //get the pdf url
    // var url = document.getElementsByClassName("full-text")[0].getElementsByTagName('a')[0].href;
    var url = loc[0].getElementsByTagName('li')[0].getElementsByTagName('a')[0].href;
    //var getUrlHttp = new XMLHttpRequest();
    //getUrlHttp.open('GET', url, true);
    //getUrlHttp.send(null);
    //var res = getUrlHttp.responseText;
    //var myRex = /(http:\/\/ieee[^"]+)/;
    //var pdfurl = res.match(myRex)[0];
    let pdfurl = url;
    if (!pdfurl.endsWith(".pdf")) {
     pdfurl = url + '.pdf';
}
    var fileName = title.toString().replace(':', '--') + '.pdf';
    obj.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + pdfurl +'>Save as pdf</a>';
    //loc.insertBefore(obj, loc.childNodes[0]);
    loc[0].insertBefore(obj, loc[0].childNodes[0]);
};
dow();
