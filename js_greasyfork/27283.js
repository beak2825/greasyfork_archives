// ==UserScript==
// @name         springer download title as pdf file name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  when download paper from arxiv.org, automate set the file name as the paper's title
// @author       EvanL00
// @match        http://link.springer.com*
// @include      http://link.springer.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27283/springer%20download%20title%20as%20pdf%20file%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/27283/springer%20download%20title%20as%20pdf%20file%20name.meta.js
// ==/UserScript==

var dow = function() {
    'use strict';
    // find the title
    var title = document.getElementsByClassName("ArticleTitle")[0].innerText;
    //find where to put the tag
    var downl = document.getElementById("download-content-placeholder");
    var url = downl.getElementsByTagName('a').href;
    var loc = document.getElementsByClassName("article-actions")[0];
    var obj = document.createElement("div");
    //get the pdf url

    var pdfurl = url;
    var fileName = title.toString().replace(':', '--') + '.pdf';
    obj.innerHTML = '<a download='+ '"'+ fileName + '"' + ' href=' + pdfurl +'>Save as pdf</a>';
    //loc.insertBefore(obj, loc.childNodes[0]);
    loc.insertBefore(obj, downl);
};
dow();
