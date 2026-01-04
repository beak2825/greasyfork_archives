// ==UserScript==
// @name         arXiv Redirect and Rename
// @include      https://arxiv.org/*
// @version      1.0
// @description  Slove the "Access Denied" problem in arXiv
//               And rename the download pdf
// @author       Daqing Liu
// @date         2020.01.07
// @namespace    http://home.ustc.edu.cn/~liudq/
// @downloadURL https://update.greasyfork.org/scripts/33051/arXiv%20Redirect%20and%20Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/33051/arXiv%20Redirect%20and%20Rename.meta.js
// ==/UserScript==

// fork from EvanL00
var dow = function() {
    'use strict';
    // find the title
    var title = document.getElementsByClassName("title mathjax")[0].innerText;
    //find where to put the tag
    var loc = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul');
    var obj = document.createElement("li");
    //get the pdf url
    var pdfurl = document.getElementsByClassName("full-text")[0].getElementsByTagName('ul')[0].getElementsByTagName('a')[0].href;
    //check name
    if (!pdfurl.endsWith(".pdf")) {
     pdfurl = pdfurl + '.pdf';
    }
    //change name
    var fileName = document.title.replace(/\.\d*/, '') + '.pdf';
    obj.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + pdfurl +'>Save as PDF</a>';
    loc[0].insertBefore(obj, loc[0].childNodes[0]);
};
dow();

var rename = function() {
    var content;
    var CheckStr = 'Access Denied';
    var IsRedirect = false;

    var stre = document.getElementsByTagName('h1');

    var i;
    for (i = 0; i < stre.length; i++) {
        content = stre[i].innerText;
        if(content.indexOf(CheckStr) != -1){
            IsRedirect = true;
        }
    }

    if(IsRedirect){
        var url = window.location.toString();
        window.location = url.replace('https://arxiv.org/', 'http://cn.arxiv.org/');
    }
};
rename();
