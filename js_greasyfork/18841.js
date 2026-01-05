// ==UserScript==
// @id             CNKI-PDF
// @name           CNKI 中国知网 PDF 全文下载
// @version        3.2.0.20170210
// @namespace      http://yuelong.info
// @author         YUE Long
// @description    参见 http://blog.yuelong.info/post/cnki-pdf-js.html
// @include        http://*.cnki.net/*
// @include        http://*.cnki.net.*/*
// @include        */kns/brief/*
// @include        */kns55/brief/*
// @include        */grid2008/brief/*
// @include        */detail/detail.aspx*
// @exclude        http://image.cnki.net/*
// @run-at         document-idle
// @grant          none
// @supportURL     http://blog.yuelong.info/post/cnki-pdf-js.html
// @downloadURL https://update.greasyfork.org/scripts/18841/CNKI%20%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%20PDF%20%E5%85%A8%E6%96%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/18841/CNKI%20%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%20PDF%20%E5%85%A8%E6%96%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var allLis, thisLi, newLi, aPDF, bPDF, allLinks, thisLink, pageType, pfType, myurl, i;
var pageType = true;
var pfType = true;
var myurl = window.location.href;

allLinks = document.evaluate(
    '//a[@href]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

allLis = document.evaluate(
    "//li[@class]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

if (myurl.indexOf("detail.aspx") != -1) {
    pageType = false;
} //false 为详情页面
if (document.title.indexOf(" - 中国知网") != -1) {
    pfType = false;
} //false 为新平台

if ((pfType === true) & (pageType === false)) {
    for (var i = 0; i < allLis.snapshotLength; i++) {
        thisLi = allLis.snapshotItem(i);
        if (thisLi.getAttribute("class").indexOf("readol") != -1) {
            newLi = document.createElement('li');
            newLi.setAttribute("class", "pdf");
            aPDF = '<a target="_blank" href="' + thisLi.firstChild.href.replace("&dflag=readonline", "&dflag=pdfdown") + '">PDF下载</a>';
            newLi.innerHTML = aPDF;
            thisLi.parentNode.insertBefore(newLi, thisLi.nextSibling);
        }
    }
}

if ((pfType === false) & (pageType === false)) {
    for (var i = 0; i < allLinks.snapshotLength; i++) {
        thisLink = allLinks.snapshotItem(i);
        if (thisLink.href && thisLink.href.indexOf("download.aspx?filename=") != -1 && thisLink.innerHTML.indexOf("整本") != -1) {
            thisLink.innerHTML = thisLink.innerHTML.replace("整本", "CAJ");
            bPDF = thisLink.href;
        }
        if (thisLink.href && thisLink.href.indexOf("download.aspx?filename=") != -1 && thisLink.innerHTML.indexOf("分页") != -1) {
            thisLink.innerHTML = thisLink.innerHTML.replace("分页", "PDF");
            thisLink.href = bPDF.replace("nhdown", "pdfdown");
        }
    }
}

if (pageType === true) {
    for (var i = 0; i < allLinks.snapshotLength; i++) {
        thisLink = allLinks.snapshotItem(i);
        if (thisLink.href && thisLink.href.indexOf("download.aspx?filename=") != -1 && thisLink.href.indexOf("&dflag") == -1) {
            thisLink.href = thisLink.href + "&dflag=pdfdown";
        }
        if (thisLink.href && thisLink.href.indexOf("download.aspx?filename=") != -1 && thisLink.href.indexOf("&dflag=nhdown") != -1) {
            thisLink.href = thisLink.href.replace("nhdown", "pdfdown");
        }
    }
}