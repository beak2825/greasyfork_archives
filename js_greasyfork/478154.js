// ==UserScript==
// @name        编程随想的博客 - 评论区修复（重制版）
// @description 基于原版评论区修复，使用标准 WebAPI 重写，并增加了一点检查和提示。
// @namespace   UnKnown
// @author      UnKnown
// @license     Unlicense
// @version     1.1
// @icon        https://program-think.blogspot.com/favicon.ico
// @match       https://program-think.blogspot.com/*
// @grant       none
// @run-at      document-start
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/478154/%E7%BC%96%E7%A8%8B%E9%9A%8F%E6%83%B3%E7%9A%84%E5%8D%9A%E5%AE%A2%20-%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E4%BF%AE%E5%A4%8D%EF%BC%88%E9%87%8D%E5%88%B6%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/478154/%E7%BC%96%E7%A8%8B%E9%9A%8F%E6%83%B3%E7%9A%84%E5%8D%9A%E5%AE%A2%20-%20%E8%AF%84%E8%AE%BA%E5%8C%BA%E4%BF%AE%E5%A4%8D%EF%BC%88%E9%87%8D%E5%88%B6%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

"use strict";

const poNullNote = [
	"编程随想的博客 - 评论区修复（重制版）：",
	"编程随想的评论区代码，需要从 a#comment-editor-src 这个超链接元素的链接中，提取一个名为 postID 的链接参数。",
	"大致在 2022 年 5 月，Google 修改了这个链接的格式。链接参数名字也从 postID 变成了 po。",
	"但评论区代码无从更新，评论区无法加载。",
	"然后就有了这个（和别的）修复脚本，工作原理大致是：找到 po，复制一份，把名字改成 postID，重新加到链接上。",
	"现在，这个脚本找不到名为 po 的链接参数，postID 也没有重新出现，所以修复大概是失效了，需要更新。",
	"请编写脚本反馈，也欢迎协助修复！",
	"目前超链接元素的链接是："
].join("\n\n");

const css = `/* 滚动过长的回复列表 */
#comments .comment-replies .comment-thread {
	margin-bottom: 1em;
	padding: 1em 0;
	background-color: rgba(0, 0, 0, 0.05);
}
#comments .comment-replies .comment-thread .sub {
	max-height: 36rem;
	overflow-y: auto;
}`;


const addPostID = () => {

	const $editor_src = document.querySelector("a#comment-editor-src");
	if ($editor_src === null) return;

	const editorUrl = new URL($editor_src.href);
	const editorParams = editorUrl.searchParams;
	if (editorParams.get("postID") !== null) return;

	const postID = editorParams.get("po");
	if (postID === null) {
		alert(poNullNote + $editor_src.href);
		return;
	}

	editorParams.set("postID", postID);
	$editor_src.href = editorUrl.href;

	const style = document.createElement("style");
	style.textContent = css;
	document.head.appendChild(style);

};

document.addEventListener("DOMContentLoaded", addPostID, { once: true });
