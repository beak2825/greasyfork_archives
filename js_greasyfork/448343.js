// ==UserScript==
// @name         arxiv跳转readpaper&dblp
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  1.go to readpaper.com; 2.rename downloaded paper; 3.go to dblp.com
// @author       Wanng
// @match        https://arxiv.org/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/448343/arxiv%E8%B7%B3%E8%BD%ACreadpaperdblp.user.js
// @updateURL https://update.greasyfork.org/scripts/448343/arxiv%E8%B7%B3%E8%BD%ACreadpaperdblp.meta.js
// ==/UserScript==

var dow = function() {
    'use strict';
    var title = document.getElementsByClassName("title mathjax")[0].innerText;
    var newurl = 'https://readpaper.com/search/'+encodeURIComponent(title);
    var dblpurl = 'https://dblp.uni-trier.de/search?q='+encodeURIComponent(title);
    //window.open(newurl)
    //window.location.href = newurl
    //find where to put the tag
    var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
    var obj1 = document.createElement("li");
    var obj2 = document.createElement("li");
    var obj3 = document.createElement("li");
    //get the pdf url
    var url = document.querySelector("#abs-outer > div.extra-services > div.full-text > ul > li > a").href
    console.log(url)
    let pdfurl = url;
    if (!pdfurl.endsWith(".pdf")) {
     pdfurl = url + '.pdf';
}
    var fileName = title.toString().replace(':', '--') + '.pdf';
    obj1.innerHTML = '<a href=' + newurl + '>ReadPaper</a>'
    obj2.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + pdfurl +'>Save&Rename</a>'
    obj3.innerHTML = '<a href=' + dblpurl + '>dblp</a>';
    loc[0].insertBefore(obj2, loc[0].childNodes[0]);
    loc[0].insertBefore(obj3, loc[0].childNodes[0]);
    loc[0].insertBefore(obj1, loc[0].childNodes[0]);
};
dow();