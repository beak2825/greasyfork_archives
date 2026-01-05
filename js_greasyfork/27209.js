// ==UserScript==
// @name         IEEE TitleAsPDFfileName
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  在下载IEEE的论文将文件名命名为题目，而不是一串数字 save the pdf file using the title as file name.
// @author       EvanL00
// @include      https://ieeexplore.ieee.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27209/IEEE%20TitleAsPDFfileName.user.js
// @updateURL https://update.greasyfork.org/scripts/27209/IEEE%20TitleAsPDFfileName.meta.js
// ==/UserScript==

function saveAsPdf() {
    // find the title
    var title = document.getElementsByClassName("document-title")[0].innerText;
    //find where to put the tag
    var loc = document.getElementsByClassName("doc-actions stats-document-lh-actions")[0];
    var downloadPdf = document.getElementsByClassName("doc-actions-link stats-document-lh-action-downloadPdf_2 ng-scope");
    //get the pdf url
    var getUrlHttp = new XMLHttpRequest();
    var lists = loc.getElementsByTagName("li");
    var urlli = lists[0];
    var atag = urlli.getElementsByTagName('a')[0];
    var suffix = atag.getAttribute("href");
    var url = suffix.toString();
    getUrlHttp.open('GET', url, false);
    getUrlHttp.send(null);
    var res = getUrlHttp.responseText;
    var myRex = /(https:\/\/ieee[^"]+)/;
    var pdfurl = res.match(myRex)[0];
    var fileName = title.toString().replace(':', '--') + '.pdf';
    downloadPdf[0].setAttribute('href',pdfurl);
    downloadPdf[0].setAttribute('download', fileName);
}
window.onload = saveAsPdf;