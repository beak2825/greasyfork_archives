// ==UserScript==
// @name         ficition txt53
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.txt53.com/html/*
// @match        http://www.txt53.com/search.html
// @match        http://www.txt53.com/search/*
// @match        https://www.txt53.com/html/*
// @match        https://www.txt53.com/search.html
// @match        https://www.txt53.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369499/ficition%20txt53.user.js
// @updateURL https://update.greasyfork.org/scripts/369499/ficition%20txt53.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var docs=document.querySelectorAll("li.qq_g a");
    for(var i=0;i<docs.length;i++){
        var doc=docs[i];
        var link=doc.getAttribute("href");
        //console.log(link.parentNode);
        doc.text=doc.text.replace("TXT下载","");
        var txtdownload=link.replace(/(http:\/\/www.txt53.com)\/html\/.*?\/txt(.*?).html/ , "$1/home/down/txt/id/$2.txt");
        var txtitem=document.createElement("a");
        var txtnode=document.createTextNode("TXT下载");
        txtitem.setAttribute("href",txtdownload);
        txtitem.setAttribute("class","txtdownload");
        txtitem.style.margin="0px 10px";
        txtitem.style.fontSize="16px";
        txtitem.appendChild(txtnode);
        var zipdownload=link.replace(/(http:\/\/www.txt53.com)\/html\/.*?\/zip(.*?).html/ , "$1/home/down/txt/id/$2.zip");
        var zipitem=document.createElement("a");
        var zipnode=document.createTextNode("ZIP下载");
        zipitem.setAttribute("href",zipdownload);
        zipitem.setAttribute("class","zipdownload");
        zipitem.style.margin="0px 10px";
        zipitem.style.fontSize="16px";
        zipitem.appendChild(zipnode);
        doc.parentNode.insertBefore(txtitem,doc.nextSibling);
        doc.parentNode.insertBefore(zipitem,doc.nextSibling);
    }
})();