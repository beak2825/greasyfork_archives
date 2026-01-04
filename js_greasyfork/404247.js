// ==UserScript==
// @name        超星 - 在 iframe 中原地打开收件箱通知
// @description 不再需要跳转整个页面，或者打开新窗口。
// @namespace   UnKnown
// @author      UnKnown
// @icon        https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg
// @version     1.0
// @match       http://notice.chaoxing.com/pc/notice/*
// @match       https://notice.chaoxing.com/pc/notice/*
// @grant       unsafeWindow
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/404247/%E8%B6%85%E6%98%9F%20-%20%E5%9C%A8%20iframe%20%E4%B8%AD%E5%8E%9F%E5%9C%B0%E6%89%93%E5%BC%80%E6%94%B6%E4%BB%B6%E7%AE%B1%E9%80%9A%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/404247/%E8%B6%85%E6%98%9F%20-%20%E5%9C%A8%20iframe%20%E4%B8%AD%E5%8E%9F%E5%9C%B0%E6%89%93%E5%BC%80%E6%94%B6%E4%BB%B6%E7%AE%B1%E9%80%9A%E7%9F%A5.meta.js
// ==/UserScript==

if ( location.pathname === "/pc/notice/myNotice" ) {

	// Notice.openDetail(this, `/pc/notice/${ noticeID }/detail`);
	unsafeWindow.Notice.openDetail = function(obj, url) {
		url && location.assign(url);
	};

} else if ( location.pathname.endsWith("/detail") ) {

	const style = document.createElement("style");
	style.textContent =
`.subPageMain,
.editContainer.noticeDetail_editContainer {
	width: auto;
}
.subPageMain {
	padding: 0 16px;
}
button.back {
	position: fixed;
	z-index: 11;
	top: 4px;
	right: 4px;
	width: 90px;
	height: 32px;
	color: white;
	background-color: transparent;
	border: 1px solid white;
}
button.back:hover,
button.back:focus {
	cursor: pointer;
	background-color: rgba(255, 255, 255, .2);
}
button.back:active {
	background-color: rgba(255, 255, 255, .4);
}`;
	document.head.appendChild(style);

	const button = document.createElement("button");

	button.className = "back";
	button.textContent = "返回";
	button.addEventListener(
		"click", function () { history.back(); }
	);

	document.body.insertBefore( button, document.body.firstChild );
	
};

