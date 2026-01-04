// ==UserScript==
// @name        超星 - 考试与作业解除各种限制，允许拉伸输入框
// @description 合并类似脚本并大幅改进，解除选择和粘贴限制，允许拉伸输入框，支持在脚本中设置输入框默认高度。
// @namespace   UnKnown
// @author      UnKnown
// @license     MIT
// @version     1.1
// @icon        https://imgsrc.baidu.com/forum/pic/item/6a63f6246b600c33c3d714d61c4c510fd9f9a106.jpg
// @match       *://*.chaoxing.com/work/doHomeWorkNew
// @match       *://*.chaoxing.com/exam/test/reVersionTestStartNew
// @match       *://*.chaoxing.com/exam/test/reVersionPaperPreview
// @match       *://*.chaoxing.com/mooc2/work/dowork
// @match       *://*.chaoxing.com/mooc2/exam/preview
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/414828/%E8%B6%85%E6%98%9F%20-%20%E8%80%83%E8%AF%95%E4%B8%8E%E4%BD%9C%E4%B8%9A%E8%A7%A3%E9%99%A4%E5%90%84%E7%A7%8D%E9%99%90%E5%88%B6%EF%BC%8C%E5%85%81%E8%AE%B8%E6%8B%89%E4%BC%B8%E8%BE%93%E5%85%A5%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/414828/%E8%B6%85%E6%98%9F%20-%20%E8%80%83%E8%AF%95%E4%B8%8E%E4%BD%9C%E4%B8%9A%E8%A7%A3%E9%99%A4%E5%90%84%E7%A7%8D%E9%99%90%E5%88%B6%EF%BC%8C%E5%85%81%E8%AE%B8%E6%8B%89%E4%BC%B8%E8%BE%93%E5%85%A5%E6%A1%86.meta.js
// ==/UserScript==

"use strict";

// 脚本 onload 函数执行超时
// 单位为毫秒，一般不用修改
const timeout = 500;

// 自定义输入框默认高度
// 	0 表示使用默认高度
// 	非零数字表示像素，负数无效
// 	字符串表示 CSS 长度，例如 "10rem"，详搜 “CSS 长度单位”
const customHeight = 0;

// 解除粘贴限制
Object.defineProperties(
	unsafeWindow, {
		// 将 allowPaste 设死为 0 以允许粘贴
		// 注意，在神秘莫测的超星前端眼中，0 表示允许粘贴，1 表示禁止粘贴
		allowPaste: { configurable: false, enumerable: true, writable: false, value: 0 },
		// 将 umyEditor_paste 设死为 null，干掉阻止粘贴的函数
		// 会导致超星的代码在设置 umyEditor_paste 时报错，属于预期行为
		myEditor_paste: { configurable: false, enumerable: true, writable: false, value: null }
	}
);

const ondom = () => {

	// 允许选择（JS 事件）
	document.body.removeAttribute("onselectstart");

	// 允许选择（CSS），允许拉伸输入框
	document.head.appendChild( document.createElement("style") ).textContent =
		"html { user-select: initial !important; }" +
		".edui-default .edui-editor-iframeholder { resize: vertical; }";

	// 设置页面标题
	const titleElement = document.querySelector('.CyTop ul.ul01 li.cur a');
	if (titleElement !== null) {
		document.title = titleElement.textContent;
	}

};

const onload = () => setTimeout(() => {

	// 解除粘贴限制 备用方案
	if (
		unsafeWindow.allowPaste == 1 && // 超星在这里也用了 == 而非 ===
		unsafeWindow.myEditor_paste instanceof Function &&
		unsafeWindow.UE instanceof Object
	) {

		const UE = unsafeWindow.UE;

		// 清除 beforepaste
		// UEditor 咋把 instances 叫成 instants…
		if ( Array.isArray(UE.instants) ) {
			UE.instants.forEach(
				instance => instance.removeListener("beforepaste", myEditor_paste)
			);
		} else if ( UE.getEditor instanceof Function ) {
			document.querySelectorAll('textarea[id]').forEach(
				textarea => UE.getEditor(textarea.id).removeListener("beforepaste", myEditor_paste)
			);
		}

	}

	// 设置输入框默认高度
	const height = (() => {
		switch (typeof customHeight) {
			case "number": return customHeight > 0    ? customHeight + "px" : false;
			case "string": return customHeight !== "" ? customHeight : false;
			default: return false;
		}
	})();

	height &&
	document.querySelectorAll(".edui-editor-iframeholder").forEach(
		iframeholder => iframeholder.style.height = height
	);

}, timeout);

const once = { once: true };

switch (document.readyState) {

	case "loading":
		document.addEventListener("DOMContentLoaded", ondom, once);
		window.addEventListener("load", onload, once);
		break;

	case "interactive":
		ondom();
		window.addEventListener("load", onload, once);
		break;

	case "complete":
		ondom();
		onload();
		break;

}
