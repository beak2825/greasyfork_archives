// ==UserScript==
// @name          download Nature in calis
// @namespace     http://minhill.com
// @description   show direct download link in nature.calis.edu.cn
// @include       http://nature.calis.edu.cn/*
// @version 1.1
// @author Hanchy Hill
// @grant none
// @license GPL
// @icon http://minhill.com/blog/wp-content/uploads/2012/03/favicon.ico
// bug 并非所有刊目的链接都能正确转换，以后有机会再弄
// @downloadURL https://update.greasyfork.org/scripts/2763/download%20Nature%20in%20calis.user.js
// @updateURL https://update.greasyfork.org/scripts/2763/download%20Nature%20in%20calis.meta.js
// ==/UserScript==

downloadLinks = document.evaluate('//a[@title="下载全文"]',document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);

for (var i = 0; i < downloadLinks.snapshotLength; i++) {
	thisLink = downloadLinks.snapshotItem(i);
    var test=/i=(\w+)&v=(\w+)&s=(\w+)&p=(\w+)/ig;
    var a=test.exec(thisLink.href);
    directLink = "http://fulltext.calis.edu.cn/nature/"+a[1]+"/"+a[2]+"/"+a[3]+"/"+a[4]+".pdf"; 
    thisLink.href=directLink;
    thisLink.target="_blank";
    thisLink.innerHTML=thisLink.innerHTML.replace("全文","<br>直接下载");
}