// ==UserScript==
// @name         TAPD 复制需求id链接
// @namespace    hl_qiu163@163.com
// @version      0.1.1
// @description  用于在需求详情页面修改 TAPD 内“复制标题&链接”、“复制ID” 功能。
// @author       qiuhongliang
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @match        https://www.tapd.cn/tapd_fe/worktable/search?dialog_preview_id=story_*
// @match        https://www.tapd.cn/*/prong/stories/view/*
// @match        https://www.tapd.cn/my_worktable*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/441737/TAPD%20%E5%A4%8D%E5%88%B6%E9%9C%80%E6%B1%82id%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/441737/TAPD%20%E5%A4%8D%E5%88%B6%E9%9C%80%E6%B1%82id%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// console.log("进入脚本");
	let page_url = window.location.href;// 网页 url，不能直接用 window.url

	let page1_key = "https://www.tapd.cn/tapd_fe/worktable/search?dialog_preview_id=story_"; // 【查询过滤】页面后的页面详情页面
	let page2_key = "https://www.tapd.cn/.*/prong/stories/view/.*"; // 以“新窗口”方式查看需求详情的页面，用得多，比如 https://www.tapd.cn/59986469/prong/stories/view/1159986469001023792
	let page3_key = "https://www.tapd.cn/my_worktable"; // 工作台页面，这个页面是两栏的。打开后显示一栏，点击需求后（选择不跳转新页面，跳转新页面则是“新窗口”）会在右边显示出第二栏，可以快速修改需求

	let is_page_type1 = (page_url.search(page1_key) !== -1) || (page_url.search(page2_key) !== -1) ;
	let is_page_type2 = (page_url.search(page3_key) !== -1);

	// console.log("is_page_type1" + is_page_type1);
	// console.log("is_page_type2" + is_page_type2);

	// 如果是页面 1
	let page_type1_btn_exists = document.getElementById("title-copy-btn-new") != null;
	if (is_page_type1 && page_type1_btn_exists) {
		let story_id = document.querySelector("#story_name_view > span.story-title-id").textContent;// id
		let story_name = document.querySelector("#story_name_view > span.editable-value").textContent;// 名字
		story_id = escape_story_id(story_id);
		story_name = escape_story_name(story_name);
		
		// 修改按钮名字
		document.querySelector("#title-copy-btn-new").textContent = "复制 ID & 标题 & 链接【markdown】";
		document.querySelector("#copy_id_new").textContent = "复制 ID & 标题";
		
		let story_id_name = story_id + " " + story_name
		document.querySelector("#copy_id_new").setAttribute("data-clipboard-text", story_id_name);

		let markdown_story = formatNameId(story_id, story_name, page_url);
		document.getElementById("title-copy-btn-new").setAttribute("data-clipboard-text", markdown_story);
		// console.log("脚本 page1:" + markdown_story);
		return;
	}

	// 如果是页面 2（工作台页面）：用事件监听方式处理。点击具体需求后不会触发脚本，所以用事件监听。
	is_page_type2 = false; // 通过事件依然无法事件： click 事件会有延迟，最坏的就是 resize 了。
	if (is_page_type2) {
		// console.log("脚本 page2:addEventListener");

		// window.addEventListener("resize", my_worktable_page_click_event);
		// document.getElementById("title-copy-btn").addEventListener("mouseover", my_worktable_page_click_event);
		// document.querySelector("body").addEventListener("resize", my_worktable_page_click_event);
		// document.querySelector("#content_div").addEventListener("click", my_worktable_page_click_event);
		// document.querySelector("body").addEventListener("click", my_worktable_page_click_event);
		// window.addEventListener("onhashchange", my_worktable_page_click_event);
		return;
	}

	function my_worktable_page_click_event() {
		let story_id = document.querySelector("#content_div > div.worktable-preview.j-worktable-preview > div > div > div.worktable-preview__head.j-worktable-preview__head > div.worktable-preview__title > div > span").textContent;// id
		let story_name = document.querySelector("#content_div > div.worktable-preview.j-worktable-preview > div > div > div.worktable-preview__head.j-worktable-preview__head > div.worktable-preview__title > div > div > span").textContent;// 名字
		let markdown_story = formatNameId(story_id, story_name, page_url);

		// console.log("脚本 page2:" + markdown_story);

		document.getElementById("title-copy-btn").setAttribute("data-clipboard-text", markdown_story);
	}

	/**
	 * 组装需求 id 和名字
	 */
	function formatNameId(story_id, story_name, page_url)
	{
		page_url = page_url == null ? "" : page_url;

		story_id = escape_story_id(story_id);
		story_name = escape_story_name(story_name);
		
		let new_story_name = story_id + " " + story_name;

		// 去除不能有的特殊字符，用于拼接成 markdown
		new_story_name = new_story_name.replace(/\[|\]/g, "");// 删除 (、)，避免注入，无法识别
		page_url = page_url.replace(/\(|\)/g, "");

		// 示例：[Chrome插件(扩展)开发全攻略](https://www.jianshu.com/p/c2affdca8ed8)
		// markdown = "[{$title}]($link)";
		return `[${new_story_name}](${page_url})`;
	}

	function escape_story_id(story_id) { 
		story_id = story_id == null ? "" : story_id;
		story_id = story_id.trim().replace(/【|】|ID/g, "");// 去除不需要的内容
		return story_id;
	}

	function escape_story_name(story_name) { 
		story_name = story_name == null ? "" : story_name;
		story_name = story_name.trim();
		return story_name;
	}

})();