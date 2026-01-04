// ==UserScript==
// @name         CPC dereferer fix
// @namespace    https://cpc.to/
// @version      1.0
// @description  Fixing derefered links on cpc.to
// @author       prismatic
// @include	 https://cpc.to/*
// @downloadURL https://update.greasyfork.org/scripts/393678/CPC%20dereferer%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/393678/CPC%20dereferer%20fix.meta.js
// ==/UserScript==

var myFavsLinks;
myFavsLinks = document.evaluate("//a[@href]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
for (var i=0;i<myFavsLinks.snapshotLength;i++) {
     var linkfix = myFavsLinks.snapshotItem(i);
     linkfix.href = linkfix.href.replace(/http:\/\/dereferer\.com\/\?/g,'https://dereferer.me/?');
}