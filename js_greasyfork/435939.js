// ==UserScript==
// @name         arxiv2readpaper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  1.go to readpaper.com;2.rename downloaded paper
// @author       Yuhang
// @match        https://arxiv.org*
// @include      https://arxiv.org*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/435939/arxiv2readpaper.user.js
// @updateURL https://update.greasyfork.org/scripts/435939/arxiv2readpaper.meta.js
// ==/UserScript==

var dow = function() {
    'use strict';
    // find the title
    var title = document.getElementsByClassName("title mathjax")[0].innerText;
    var newurl = 'https://readpaper.com/search/'+encodeURIComponent(title);
    //window.open(newurl)
    //window.location.href = newurl
    //find where to put the tag
    var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
    var obj1 = document.createElement("li");
    var obj2 = document.createElement("li");
    //get the pdf url
    var url = document.querySelector("#abs-outer > div.extra-services > div.full-text > ul > li:nth-child(1) > a").href
    console.log(url)
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
    obj1.innerHTML = '<a href=' + newurl + '>ReadPaper</a>'
    obj2.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + pdfurl +'>Save&Rename</a>';
    loc[0].insertBefore(obj2, loc[0].childNodes[0]);
    loc[0].insertBefore(obj1, loc[0].childNodes[0]);
};
dow();