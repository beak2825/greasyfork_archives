// ==UserScript==
// @name        超星 - 自动提示签到（防钓鱼签到专用）
// @description 定时刷新并检查签到列表页面，自动提示签到。会发通知或 alert() 弹窗提示，别的什么都不会干！不能点开签到！适用于钓鱼签到、答题签到等复杂情况。有弹窗提示时，勾选“允许来自 mobilelearn.chaoxing.com 的对话框将您带往标签页”，以自动切回签到列表页面的标签页；可以在代码最后处更改自动刷新时间。
// @comment     建议为搞钓鱼签到的好老师多做点宣传。
// @namespace   UnKnown
// @author      UnKnown
// @icon        https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg
// @version     2.1
// @match       *://mobilelearn.chaoxing.com/widget/pcpick/stu/index
// @grant       window.focus
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/404081/%E8%B6%85%E6%98%9F%20-%20%E8%87%AA%E5%8A%A8%E6%8F%90%E7%A4%BA%E7%AD%BE%E5%88%B0%EF%BC%88%E9%98%B2%E9%92%93%E9%B1%BC%E7%AD%BE%E5%88%B0%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/404081/%E8%B6%85%E6%98%9F%20-%20%E8%87%AA%E5%8A%A8%E6%8F%90%E7%A4%BA%E7%AD%BE%E5%88%B0%EF%BC%88%E9%98%B2%E9%92%93%E9%B1%BC%E7%AD%BE%E5%88%B0%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

"use strict";

for ( const Mct of document.querySelectorAll( '#startList > div > .Mct' ) ) {

	const getText = ( selector, altText = "" ) => {
		const element = Mct.querySelector(':scope > ' + selector);
		return element !== null ? element.textContent.trim() : altText;
	}

	const type = getText('.dl_icon > a'); // 活动类型
	const desc = getText('.Mct_center > a', "无简介");

	if ( type !== "分组任务" ) {

		/*this.GM_notification instanceof Function
			? GM_notification(
				"有签到", desc, "https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg"
			)
			: */
		window.focus();
		alert( "有签到：\n" + desc );

	}

}

// 500000 毫秒 = 60 * 1000 * 25 / 3 毫秒 ≈ 8.333 分钟
setTimeout(
	() => location.reload(), 500000
);
