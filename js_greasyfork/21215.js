// ==UserScript==
// @name        Better Unity Forums
// @namespace   BUF
// @description Fixes a lot of the issues people have with the new forum style
// @include     https://community.unity.com/*
// @version     1.3
// @grant       GM_addStyle
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/21215/Better%20Unity%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/21215/Better%20Unity%20Forums.meta.js
// ==/UserScript==

const d = ((typeof unsafeWindow === "object") ? unsafeWindow : window).document;

function xpath(doc, query) {
  return doc.evaluate(query, doc, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

function replacement(){
  var avatars = xpath(d,"//div[contains(@class,'author')]//a[contains(@class,'UserAvatar')]/img[contains(@src,'/38x38/') or contains(@src,'avatar-display-size/message/')]");

	for(var i=0;i<avatars.snapshotLength;i++){
		avatars.snapshotItem(i).src = avatars.snapshotItem(i).src.replace('/38x38/','/96x96/');
		avatars.snapshotItem(i).src = avatars.snapshotItem(i).src.replace('avatar-display-size/message/','avatar-display-size/profile/');
	}
	
	var leftcols = xpath(d,"//div[contains(@class,'lia-quilt-layout-two-column-message')]/div[contains(@class,'lia-quilt-row-main')]/div[contains(@class,'lia-quilt-column-04')]");
	for(var i=0;i<leftcols.snapshotLength;i++){
		leftcols.snapshotItem(i).className = leftcols.snapshotItem(i).className.replace('column-04','column-03');
	}
	
	var rightcols = xpath(d,"//div[contains(@class,'lia-quilt-layout-two-column-message')]/div[contains(@class,'lia-quilt-row-main')]/div[contains(@class,'lia-quilt-column-18')]");
	for(var i=0;i<rightcols.snapshotLength;i++){
		rightcols.snapshotItem(i).className = rightcols.snapshotItem(i).className.replace('column-18','column-21');
	}
	GM_addStyle(".fancy-select ul li { list-style: none !important; display: none !important;}");
	GM_addStyle(".lia-quilt-layout-two-column-message > .lia-quilt-row-footer > .lia-quilt-column-right { width: 100% !important;}");
	GM_addStyle(".lia-message-body-content li {font-size : 14px !important;}");
	GM_addStyle(".lia-quilt-layout-two-column-message > .lia-quilt-row-main > div {margin-bottom: 15px !important;}");
	GM_addStyle(".lia-message-body-content > pre { font-size: medium !important;}");
	GM_addStyle(".lia-quilt-row-header { padding: 15px 40px 0px 40px !important;}");
	GM_addStyle(".lia-message-author-username {display:block !important} .lia-message-author-avatar .UserAvatar > img {min-width:96px !important; height: 96px !important; border-radius: 2px !important;}");
}

replacement();
