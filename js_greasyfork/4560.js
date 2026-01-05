// ==UserScript==
// @name       mTurk List adf.ly rewriter
// @namespace  http://ZeroSama.co.vu:81/
// @version    2.1
// @description  Rewrites adfly links on mTurk List to direct links
// @UpdateURL https://greasyfork.org/scripts/4560-mturk-list-adf-ly-rewriter/code/mTurk%20List%20adfly%20rewriter.user.js
// @match    http://www.mturklist.com/* 
// @copyright  2014+, ZeroSama
// @downloadURL https://update.greasyfork.org/scripts/4560/mTurk%20List%20adfly%20rewriter.user.js
// @updateURL https://update.greasyfork.org/scripts/4560/mTurk%20List%20adfly%20rewriter.meta.js
// ==/UserScript==
//
//
//	ChangeLog
//		v1.0 Initial release
//
//		v2.0 Removed the need for external server
//
//		v2.1 Upload to GreasyFork
//
//


    var links,thisLink;
links = document.evaluate("//a[@href]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i=0;i<links.snapshotLength;i++) {
    var thisLink = links.snapshotItem(i);
	var hrefTemp=thisLink.href;
    hrefTemp = hrefTemp.replace('http://adf.ly/','');
	var Hsplit = hrefTemp.split('/');
		Hsplit.reverse();
		Hsplit.pop();
		Hsplit.reverse();
	hrefTemp= Hsplit.join('/');
	thisLink.href = (decodeURIComponent(hrefTemp)).replace("/","");

}